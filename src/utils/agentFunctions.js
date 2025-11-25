import emailjs from "@emailjs/browser";
import config from "../config/env";

export const functions = [
  {
    type: "function",
    function: {
      name: "schedule_email_reminder",
      description: "Schedule a reminder and send an email",
      parameters: {
        type: "object",
        properties: {
          task: {
            type: "string",
            description: "The task to be reminded about",
          },
          time: {
            type: "string",
            description: "The time to send the reminder (ISO format)",
          },
          email: {
            type: "string",
            description: "The recipient's email address",
          },
        },
        required: ["task", "time", "email"],
      },
    },
  },
];

export const sendEmailReminder = async ({ task, time, email }) => {
  if (
    !config.emailjs.serviceId ||
    !config.emailjs.templateId ||
    !config.emailjs.publicKey
  ) {
    throw new Error(
      "EmailJS is not properly configured. Please check your environment variables."
    );
  }

  try {
    const templateParams = {
      task,
      time: new Date(time).toLocaleString(),
      to_email: email,
    };

    await emailjs.send(
      config.emailjs.serviceId,
      config.emailjs.templateId,
      templateParams,
      config.emailjs.publicKey
    );

    console.log(" Email sent successfully to:", email);
    return { success: true };
  } catch (error) {
    console.error(" Failed to send email:", error);
    throw error;
  }
};

export const scheduleReminder = ({ task, time, email }) => {
  let delay = new Date(time) - Date.now();
  if (delay < 0) {
    console.warn("Reminder time is in the past, sending immediately");
    delay = 0;
  }
  console.log(`📅 Reminder scheduled for: ${new Date(time).toLocaleString()}`);
  console.log(`⏱️ Delay: ${Math.round(delay / 1000)}s`);

  setTimeout(async () => {
    try {
      await sendEmailReminder({ task, time, email });
      console.log("✅ Reminder sent successfully");
    } catch (error) {
      console.error("❌ Failed to send scheduled reminder:", error);
    }
  }, delay);

  return {
    success: true,
    scheduledFor: new Date(time).toISOString(),
    delay: delay,
  };
};

export const validateReminderParams = ({ task, time, email }) => {
  const errors = [];

  if (!task || task.trim().length === 0) {
    errors.push("Task cannot be empty");
  }

  if (!email || !email.includes("@")) {
    errors.push("Invalid email address");
  }

  try {
    const reminderTime = new Date(time);
    if (isNaN(reminderTime.getTime())) {
      errors.push("Invalid time format");
    }
  } catch {
    errors.push("Invalid time format");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export default {
  functions,
  scheduleReminder,
  sendEmailReminder,
  validateReminderParams,
};
