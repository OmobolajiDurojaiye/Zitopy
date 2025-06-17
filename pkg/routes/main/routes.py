from . import main_bp
from flask import render_template, request, flash, redirect, url_for, jsonify, current_app
from pkg.models import db, Contact
from flask_mail import Mail, Message
import logging

# Configure logging to help debug email issues
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Initialize Mail instance
mail = Mail()

@main_bp.route('/')
def landing():
    # return render_template('main/under_maintainance.html')
    return render_template('main/home.html')

@main_bp.route('/contact', methods=['POST'])
def submit_contact():
    try:
        name = request.form.get('name', '').strip()
        email = request.form.get('email', '').strip()
        subject = request.form.get('subject', '').strip()
        message = request.form.get('message', '').strip()

        if not all([name, email, subject, message]):
            flash('All fields are required!', 'error')
            return redirect(url_for('main.landing') + '#contact')

        if '@' not in email or '.' not in email:
            flash('Please enter a valid email address!', 'error')
            return redirect(url_for('main.landing') + '#contact')

        # Save to database first
        new_contact = Contact(name=name, email=email, subject=subject, message=message)
        db.session.add(new_contact)
        db.session.commit()

        # Send email with better error handling
        try:
            msg = Message(
                subject=f"New Contact Submission: {subject}",
                sender="zitopytech@gmail.com",  # Use the configured email directly
                recipients=["zitopytech@gmail.com"]
            )
            
            # Format HTML email with styling (similar to unsigned_global_courier approach)
            msg.html = f"""
            <html>
            <body style="font-family: Arial, sans-serif; background-color: #f8f9fa; color: #333; padding: 20px;">
                <div style="background-color: #ffffff; padding: 30px; border-radius: 12px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); max-width: 600px; margin: auto;">
                    <h2 style="color: #42b0d5;">New Contact Form Submission</h2>
                    
                    <div style="margin: 20px 0;">
                        <p><strong>Name:</strong> {name}</p>
                        <p><strong>Email:</strong> {email}</p>
                        <p><strong>Subject:</strong> {subject}</p>
                    </div>
                    
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h4 style="color: #495057; margin-top: 0;">Message:</h4>
                        <div style="white-space: pre-wrap; line-height: 1.5;">
{message}
                        </div>
                    </div>
                    
                    <hr style="margin: 20px 0;">
                    <p style="color: #6c757d;">— Zitopy Tech Contact System</p>
                    <p style="font-size: 12px; color: #999;">
                        Reply directly to this email to respond to {name} at {email}
                    </p>
                </div>
            </body>
            </html>
            """
            
            # Set reply-to as the user's email
            msg.reply_to = email
            
            # Send the email
            mail.send(msg)
            logger.info(f"Email sent successfully for contact from {email}")
            
        except Exception as email_error:
            logger.error(f"Failed to send email: {str(email_error)}")
            # Continue without failing the entire request
            flash("Your message was saved successfully, but there was an issue sending the email notification.", 'warning')
            return redirect(url_for('main.landing') + '#contact')

        flash("Thank you for your message! We'll get back to you soon.", 'success')
        return redirect(url_for('main.landing') + '#contact')

    except Exception as e:
        logger.error(f"Error in contact form submission: {str(e)}")
        db.session.rollback()
        flash('Something went wrong. Please try again later.', 'error')
        return redirect(url_for('main.landing') + '#contact')


@main_bp.route('/api/contact', methods=['POST'])
def api_submit_contact():
    """API endpoint for AJAX form submission"""
    try:
        data = request.get_json()
        
        # Get form data
        name = data.get('name', '').strip()
        email = data.get('email', '').strip()
        subject = data.get('subject', '').strip()
        message = data.get('message', '').strip()
        
        # Basic validation
        if not all([name, email, subject, message]):
            return jsonify({
                'success': False,
                'message': 'All fields are required!'
            }), 400
        
        # Email validation (basic)
        if '@' not in email or '.' not in email:
            return jsonify({
                'success': False,
                'message': 'Please enter a valid email address!'
            }), 400
        
        # Create new contact entry
        new_contact = Contact(
            name=name,
            email=email,
            subject=subject,
            message=message
        )
        
        # Save to database
        db.session.add(new_contact)
        db.session.commit()
        
        # Send email with error handling
        try:
            msg = Message(
                subject=f"New Contact Submission: {subject}",
                sender="zitopytech@gmail.com",
                recipients=["zitopytech@gmail.com"]
            )
            
            # Format HTML email with styling
            msg.html = f"""
            <html>
            <body style="font-family: Arial, sans-serif; background-color: #f8f9fa; color: #333; padding: 20px;">
                <div style="background-color: #ffffff; padding: 30px; border-radius: 12px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); max-width: 600px; margin: auto;">
                    <h2 style="color: #42b0d5;">New Contact Form Submission (API)</h2>
                    
                    <div style="margin: 20px 0;">
                        <p><strong>Name:</strong> {name}</p>
                        <p><strong>Email:</strong> {email}</p>
                        <p><strong>Subject:</strong> {subject}</p>
                    </div>
                    
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h4 style="color: #495057; margin-top: 0;">Message:</h4>
                        <div style="white-space: pre-wrap; line-height: 1.5;">
{message}
                        </div>
                    </div>
                    
                    <hr style="margin: 20px 0;">
                    <p style="color: #6c757d;">— Zitopy Tech Contact System</p>
                    <p style="font-size: 12px; color: #999;">
                        Reply directly to this email to respond to {name} at {email}
                    </p>
                </div>
            </body>
            </html>
            """
            
            msg.reply_to = email
            mail.send(msg)
            logger.info(f"Email sent successfully for API contact from {email}")
            
        except Exception as email_error:
            logger.error(f"Failed to send email via API: {str(email_error)}")
            # Return success anyway since the contact was saved
            return jsonify({
                'success': True,
                'message': 'Your message was saved successfully, but there was an issue sending the email notification.'
            })
        
        return jsonify({
            'success': True,
            'message': 'Thank you for your message! We\'ll get back to you soon.'
        })
        
    except Exception as e:
        logger.error(f"Error in API contact submission: {str(e)}")
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': 'Something went wrong. Please try again later.'
        }), 500