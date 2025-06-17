from . import main_bp
from flask import render_template, request, flash, redirect, url_for, jsonify, current_app
from pkg.models import db, Course, Order, OrderItem
from flask_mail import Mail, Message
import logging
import json

logger = logging.getLogger(__name__)
# Best practice is to initialize Mail in your app factory and import it
# but following the existing pattern in routes.py
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
            flash('Your cart is empty.', 'error')
            return redirect(url_for('main.landing'))

        total_amount = sum(item['price'] for item in cart_items)

        # Create the Order
        new_order = Order(
            customer_name=name,
            customer_email=email,
            total_amount=total_amount
        )
        db.session.add(new_order)
        
        # Create OrderItems and associate with the Order
        for item in cart_items:
            # We assume the item['id'] from the cart is the course's database ID
            # A more robust implementation might fetch the course from DB first
            # to ensure data integrity, but this works for the current setup.
            order_item = OrderItem(
                order=new_order,
                course_id=item['id'],
                course_title=item['name'],
                price_at_purchase=item['price'],
                quantity=item.get('quantity', 1)
            )
            db.session.add(order_item)
            
        db.session.commit()

        # Send notification email
        try:
            msg = Message(
                subject=f"New Course Order from {name}",
                sender=current_app.config['MAIL_USERNAME'],
                recipients=[current_app.config['MAIL_USERNAME']] # Send to admin
            )
            
            items_html = ""
            for item in cart_items:
                items_html += f"<li>{item['name']} - ₦{item['price']:,}</li>"

            msg.html = f"""
            <html><body>
                <h2>New Course Order #{new_order.id}</h2>
                <p><strong>Name:</strong> {name}</p>
                <p><strong>Email:</strong> {email}</p>
                <h3>Courses Ordered (First Month):</h3>
                <ul>{items_html}</ul>
                <h3>Total (Per Month): ₦{total_amount:,}</h3>
                <p>Please follow up with the customer to arrange payment (Paystack etc.).</p>
            </body></html>
            """
            mail.send(msg)
        except Exception as email_error:
            logger.error(f"Failed to send order notification email: {email_error}")
            # The order is saved, so we still show a success message to the user.
            # We just log the email failure.

        flash('Your order has been placed! We will contact you shortly to arrange payment.', 'success')
        return redirect(url_for('main.landing'))

    except Exception as e:
        logger.error(f"Error creating order: {e}")
        db.session.rollback()
        flash('There was an error placing your order. Please try again.', 'error')
        return redirect(url_for('main.checkout'))