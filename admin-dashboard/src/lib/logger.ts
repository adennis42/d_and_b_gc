/**
 * Centralized logging utility for admin dashboard API routes
 * Provides structured logging with consistent format
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogContext {
  userId?: string;
  userEmail?: string;
  operation?: string;
  resourceId?: string;
  metadata?: Record<string, unknown>;
}

class Logger {
  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? JSON.stringify(context) : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message} ${contextStr}`;
  }

  private log(level: LogLevel, message: string, context?: LogContext, error?: Error): void {
    const formattedMessage = this.formatMessage(level, message, context);
    
    if (error) {
      console[level](formattedMessage, {
        error: {
          message: error.message,
          stack: error.stack,
          name: error.name,
        },
      });
    } else {
      console[level](formattedMessage);
    }
  }

  info(message: string, context?: LogContext): void {
    this.log('info', message, context);
  }

  warn(message: string, context?: LogContext): void {
    this.log('warn', message, context);
  }

  error(message: string, context?: LogContext, error?: Error): void {
    this.log('error', message, context, error);
  }

  debug(message: string, context?: LogContext): void {
    if (process.env.NODE_ENV === 'development') {
      this.log('debug', message, context);
    }
  }

  /**
   * Log API operation start
   */
  operationStart(operation: string, context?: LogContext): void {
    this.info(`Starting ${operation}`, { ...context, operation });
  }

  /**
   * Log API operation success
   */
  operationSuccess(operation: string, context?: LogContext): void {
    this.info(`Successfully completed ${operation}`, { ...context, operation });
  }

  /**
   * Log API operation failure
   */
  operationFailure(operation: string, error: Error, context?: LogContext): void {
    this.error(`Failed to ${operation}`, { ...context, operation }, error);
  }
}

export const logger = new Logger();

