
/**
 * Utility function to format a list of appointments into a readable email body.
 * @param {Array} appointments - List of appointments to summarize.
 * @returns {{text: string, html: string}} - Formatted email content.
 */

const formatAppointmentsForEmail = (appointments) => {
  let textSummary = "You have the following upcoming appointments:\n\n";
  let htmlSummary = "<h2>Upcoming Appointment Reminders</h2><ul>";

  appointments.forEach(app => {
    // Formatting the date nicely for readability
    const formattedDate = new Date(app.datetime).toLocaleString('en-US', {
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit'
    });
    
    const therapistName = app.therapist.name || 'Your Therapist'; 
    const duration = app.duration;

    textSummary += `- Therapist: ${therapistName}\n`;
    textSummary += `  Time: ${formattedDate} (${duration} mins)\n\n`;

    htmlSummary += `<li><strong>Therapist:</strong> ${therapistName}<br>`;
    htmlSummary += `<strong>Time:</strong> ${formattedDate}<br>`;
    htmlSummary += `<strong>Duration:</strong> ${duration} hours</li><br>`;
  });
  
  htmlSummary += "</ul><p>Please log in to your dashboard to view more details.</p>";

  return { text: textSummary, html: htmlSummary };
}

module.exports = {formatAppointmentsForEmail};
