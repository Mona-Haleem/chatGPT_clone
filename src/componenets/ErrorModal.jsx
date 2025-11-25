import styles from "./ErrorModal.module.css";

const getErrorIcon = (type) => {
  switch (type) {
    case "quota":
      return "💳";
    case "rate_limit":
      return "⏱️";
    case "auth":
      return "🔑";
    case "network":
      return "🌐";
    case "server":
      return "🔧";
    default:
      return "⚠️";
  }
};
const getActionButton = (type) => {
  switch (type) {
    case "quota":
      return (
        <a
          href="https://platform.openai.com/account/billing"
          target="_blank"
          rel="noopener noreferrer"
          className={styles["error-action-btn"]}
        >
          Check Billing
        </a>
      );
    case "auth":
      return (
        <a
          href="https://platform.openai.com/api-keys"
          target="_blank"
          rel="noopener noreferrer"
          className="error-action-btn"
        >
          Manage API Keys
        </a>
      );
    default:
      return null;
  }
};

const ErrorModal = ({ error, onClose }) => {
  if (!error) return null;

  return (
    <div className={styles["error-modal-overlay"]} onClick={onClose}>
      <div className={styles["error-modal"]} onClick={(e) => e.stopPropagation()}>
        <div className={styles["error-modal-header"]}>
          <span className={styles["error-icon"]}>{getErrorIcon(error.type)}</span>
          <h3>{error.title}</h3>
          <button className={styles["error-close"]} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles["error-modal-body"]}>
          <p>{error.message}</p>

          {error.type === "quota" && (
            <div className={styles["error-help"]}>
              <strong>Common solutions:</strong>
              <ul>
                <li>Check your OpenAI billing dashboard</li>
                <li>Add payment method if not configured</li>
                <li>Verify your usage limits</li>
                <li>Wait for your quota to reset</li>
              </ul>
            </div>
          )}

          {error.type === "auth" && (
            <div className={styles["error-help"]}>
              <strong>Configuration required:</strong>
              <ul>
                <li>Verify your API key in .env file</li>
                <li>Ensure VITE_OPENAI_API_KEY is set</li>
                <li>Check Vercel environment variables (if deployed)</li>
              </ul>
            </div>
          )}
        </div>

        <div className={styles["error-modal-footer"]}>
          {getActionButton(error.type)}
          <button className={styles["error-dismiss-btn"]} onClick={onClose}>
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;
