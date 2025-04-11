import emailjs from '@emailjs/browser';

export const functions = [
    {
      name: "schedule_email_reminder",
      description: "Schedule a reminder and send an email",
      parameters: {
        type: "object",
        properties: {
          task: {
            type: "string",
            description: "The task to be reminded about"
          },
          time: {
            type: "string",
            description: "The time to send the reminder (ISO format)"
          },
          email: {
            type: "string",
            description: "The recipient's email address"
          }
        },
        required: ["task", "time", "email"]
      }
    }
  ];
  

  export const sendEmailReminder = async ({ task, time, email }) => {
    try {
      const templateParams = {
        task,
        time: new Date(time).toLocaleString(),
        to_email: email,
      };
  
      await emailjs.send(
        'service_01z1ddu',
        'template_21fud05',
        templateParams,
        'VDSYna121mch3Sl_N'
      );
  
      console.log('✅ Email sent');
    } catch (error) {
      console.error('❌ Failed to send email:', error);
    }
  };

export  const scheduleReminder = ({ task, time, email }) => {
    let delay = new Date(time) - Date.now();
    if (delay <= 0)delay = 0;
    console.log(delay,time,Date.now());

    setTimeout(() => {
      sendEmailReminder({ task, time, email });
    }, delay);
  };