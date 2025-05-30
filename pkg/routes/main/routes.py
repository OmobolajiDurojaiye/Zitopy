from . import main_bp
from flask import render_template, request, flash, redirect, url_for, jsonify
from pkg.models import db, Contact

@main_bp.route('/')
def landing():
    return render_template('main/home.html')

@main_bp.route('/contact', methods=['POST'])
def submit_contact():
    try:
        # Get form data
        name = request.form.get('name', '').strip()
        email = request.form.get('email', '').strip()
        subject = request.form.get('subject', '').strip()
        message = request.form.get('message', '').strip()
        
        # Basic validation
        if not all([name, email, subject, message]):
            flash('All fields are required!', 'error')
            return redirect(url_for('main.landing') + '#contact')
        
        # Email validation (basic)
        if '@' not in email or '.' not in email:
            flash('Please enter a valid email address!', 'error')
            return redirect(url_for('main.landing') + '#contact')
        
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
        
        flash('Thank you for your message! We\'ll get back to you soon.', 'success')
        return redirect(url_for('main.landing') + '#contact')
        
    except Exception as e:
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
        
        return jsonify({
            'success': True,
            'message': 'Thank you for your message! We\'ll get back to you soon.'
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': 'Something went wrong. Please try again later.'
        }), 500