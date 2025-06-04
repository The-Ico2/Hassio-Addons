
// Ensure Flask is available globally
var Flask = Flask || {};
Flask.url_for = function(endpoint, filename) {
    // This function should return the URL for the given Flask endpoint 
    // You can implement this function based on your Flask app's URL structure
    // For example, if you have a route like @app.route('/static/<path:filename>')
    switch (endpoint) {
        case 'static':
            if (!filename) {
                console.error('Filename is required for static URL generation.');
                return '';
            }
            // Return the static file URL
            return `/static/${filename}`;
        case 'media':
            console.log("Generating media URL for filename: %s", filename);
            // This is for media files, such as sounds or images
            // Ensure the filename is provided

            if (!filename) {
                console.error('Filename is required for media URL generation.');
                return '';
            }
            // Return the media file URL
            return `/static/media/${filename}`;
        default:
            console.error(`Unknown endpoint: ${endpoint}`);
            return '';
    }
}
// Main JavaScript file for Control Display
// This file handles sound playback and navigation events
// Ensure the Flask object is defined
if (typeof Flask === 'undefined') {
    console.error('Flask object is not defined. Ensure Flask is properly initialized.');
}

document.addEventListener('DOMContentLoaded', function() {
    // Play sound if requested
    switch (sessionStorage.getItem('playSound')) {
        case 'ping':
            var ping = new Audio(`${ Flask.url_for('media', 'sounds/ping.mp3')}`);
            ping.play();
            sessionStorage.removeItem('playSound');
            break;
            
        case 'click':
            var click = new Audio(`${ Flask.url_for('media', filename='sounds/click.mp3')}`);
            click.play();
            sessionStorage.removeItem('playSound');
            break;

        case 'error':
            var error = new Audio(`${ Flask.url_for('media', filename='sounds/error.mp3')}`);
            error.play();
            sessionStorage.removeItem('playSound');
            break;

        case 'notification':
            var notification = new Audio(`${ Flask.url_for('media', filename='sounds/notification.mp3')}`);
            notification.play();
            sessionStorage.removeItem('playSound');
            break;
        
        case 'alert':
            var alert = new Audio(`${ Flask.url_for('media', filename='sounds/alert.mp3')}`);
            alert.play();
            sessionStorage.removeItem('playSound');
            break;

        default:
            // No sound to play
            break;
        // Add more cases for different sounds if needed
    }

    // Set playSound flag on navigation
    document.querySelectorAll('nav.control a[data-sound]').forEach(function(link) {
        link.addEventListener('click', function(e) {
            sessionStorage.setItem('playSound', this.getAttribute('data-sound'));
        });
    });
});