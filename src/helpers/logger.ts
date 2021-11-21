import boxen from "boxen";
import chalk from "chalk";

export enum Severity {
  success = "success",
  warning = "warning",
  error = "error",
  neutral = "neutral",
}

const LOGGERS = {
  success: chalk.green.underline,
  warning: chalk.yellow.underline,
  error: chalk.red.underline,
  neutral: chalk.white,
};
const BOX_COLORS = {
  success: "green",
  warning: "yellow",
  error: "red",
  neutral: "white",
};

export default function logger(
  message: string,
  severity: Severity = Severity.success,
  box?: boolean
) {
  const log = `${LOGGERS[severity](severity)} - ${message}`;

  if (box) {
    console.log(
      boxen(log, {
        padding: 1,
        borderColor: BOX_COLORS[severity],
      })
    );
    return;
  }
  console.log(log);
}
