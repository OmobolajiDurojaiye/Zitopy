from . import main_bp
from flask import render_template, request, flash, redirect, url_for, jsonify, current_app
from pkg.models import db, Course, Order, OrderItem
from flask_mail import Mail, Message
import logging
import json

logger = logging.getLogger(__name__)
mail = Mail()

@main_bp.route('/checkout')
def checkout():
    """Renders the checkout page."""
    return render_template('main/checkout.html')

@main_bp.route('/order/create', methods=['POST'])
def create_order():
    """
    Handles the submission from the checkout page.
    Saves the order to the database and sends a notification email.
    """
    try:
        data = request.form
        name = data.get('name', '').strip()
        email = data.get('email', '').strip()
        cart_items_json = data.get('cart_items', '[]')
        
        if not name or not email:
            flash('Name and Email are required.', 'error')
            return redirect(url_for('main.checkout'))

        cart_items = json.loads(cart_items_json)
        if not cart_items:
            flash('Your cart is empty. Please add a course to proceed.', 'error')
            return redirect(url_for('main.landing'))

        # Recalculate total amount on the server for security
        total_amount = sum(int(item['price']) for item in cart_items)

        # Create the Order
        new_order = Order(
            customer_name=name,
            customer_email=email,
            total_amount=total_amount,
            status='pending'
        )
        db.session.add(new_order)
        
        # Create OrderItems and associate with the Order
        for item in cart_items:
            # The full plan name and duration for storage
            full_plan_details = f"{item['planName']} ({item['duration']})"

            order_item = OrderItem(
                order=new_order,
                course_id=item['id'],
                course_title=item['name'],
                price_at_purchase=item['price'], # This is the total price for the plan
                quantity=1, # Quantity is always 1 for a plan package
                payment_option=full_plan_details
            )
            db.session.add(order_item)
            
        db.session.commit()

        # Send a more detailed notification email
        try:
            msg = Message(
                subject=f"New Course Order #{new_order.id} from {name}",
                sender=current_app.config['MAIL_USERNAME'],
                recipients=[current_app.config['MAIL_USERNAME']] # Send to admin
            )
            
            items_html = ""
            for item in cart_items:
                price_text = f"₦{int(item['price']):,}"
                if item['duration'] == 'per month':
                    price_text += " /mo"

                items_html += f"""
                    <tr style="border-bottom: 1px solid #eee;">
                        <td style="padding: 10px; vertical-align: top;">{item['name']}</td>
                        <td style="padding: 10px; vertical-align: top;">{item['planName']} ({item['duration']})</td>
                        <td style="padding: 10px; text-align: right; vertical-align: top;"><strong>{price_text}</strong></td>
                    </tr>
                """

            msg.html = f"""
            <html>
            <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; margin: 0; padding: 0; background-color: #f4f4f4;">
                <div style="max-width: 700px; margin: 20px auto; border: 1px solid #ddd; padding: 30px; border-radius: 8px; background-color: #ffffff;">
                    <h2 style="color: #0056b3; border-bottom: 2px solid #0056b3; padding-bottom: 10px;">New Course Order #{new_order.id}</h2>
                    <p><strong>Customer Name:</strong> {name}</p>
                    <p><strong>Customer Email:</strong> <a href="mailto:{email}" style="color: #0056b3;">{email}</a></p>
                    <hr style="border: 0; border-top: 1px solid #eee;">
                    <h3>Order Details:</h3>
                    <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                        <thead>
                            <tr style="background-color: #f7f7f7;">
                                <th style="padding: 12px; text-align: left;">Course</th>
                                <th style="padding: 12px; text-align: left;">Selected Plan</th>
                                <th style="padding: 12px; text-align: right;">Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items_html}
                        </tbody>
                    </table>
                    <hr style="border: 0; border-top: 1px solid #eee; margin-top: 20px;">
                    <div style="text-align: right; margin-top: 20px; font-size: 18px;">
                        <strong>Total Amount Due: <span style="color: #28a745; font-size: 22px;">₦{total_amount:,}</span></strong>
                    </div>
                    <p style="margin-top: 30px; font-size: 14px; color: #555; background-color: #f0f8ff; padding: 15px; border-radius: 5px; border-left: 4px solid #0056b3;">
                        <strong>Next Step:</strong> Please follow up with the customer to arrange payment and confirm their enrollment details.
                    </p>
                </div>
            </body>
            </html>
            """
            mail.send(msg)
        except Exception as email_error:
            logger.error(f"Failed to send order notification email for order #{new_order.id}: {email_error}")
            # The order is saved, so we still show a success message to the user.
            # We just log the email failure.

        flash('Your order has been placed! We will contact you shortly to arrange payment and finalize your enrollment.', 'success')
        return redirect(url_for('main.landing'))

    except Exception as e:
        logger.error(f"Error creating order: {e}")
        db.session.rollback()
        flash('There was an error placing your order. Please try again.', 'error')
        return redirect(url_for('main.checkout'))