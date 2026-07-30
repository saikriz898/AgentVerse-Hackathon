import asyncio
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional
from app.config.settings import settings
from app.utils.logger import logger

class RealEmailService:
    @staticmethod
    def _send_smtp_sync(recipient: str, subject: str, body: str, cc: Optional[str] = None) -> dict:
        smtp_host = os.getenv("SMTP_HOST", "smtp.gmail.com")
        smtp_port = int(os.getenv("SMTP_PORT", "587"))
        smtp_user = os.getenv("SMTP_USER", "")
        smtp_password = os.getenv("SMTP_PASSWORD", "")
        from_email = os.getenv("SMTP_FROM_EMAIL", smtp_user or "agent@lifeos.ai")

        msg = MIMEMultipart()
        msg["From"] = from_email
        msg["To"] = recipient
        msg["Subject"] = subject
        if cc:
            msg["Cc"] = cc

        msg.attach(MIMEText(body, "plain", "utf-8"))

        recipients_list = [recipient]
        if cc:
            recipients_list.extend([c.strip() for c in cc.split(",") if c.strip()])

        if smtp_user and smtp_password:
            try:
                server = smtplib.SMTP(smtp_host, smtp_port, timeout=10)
                server.starttls()
                server.login(smtp_user, smtp_password)
                server.sendmail(from_email, recipients_list, msg.as_string())
                server.quit()
                logger.info(f"Real SMTP Email dispatched successfully to {recipient}")
                return {
                    "status": "sent",
                    "delivery_mode": "real_smtp",
                    "recipient": recipient,
                    "subject": subject
                }
            except Exception as e:
                logger.error(f"SMTP Dispatch Error: {str(e)}")
                raise RuntimeError(f"SMTP Dispatch failed: {str(e)}")
        else:
            # Fallback mock logger for local dev when SMTP credentials are not yet configured in .env
            logger.info(f"[EMAIL DISPATCH SIMULATION] To: {recipient} | Subject: {subject} | Body Length: {len(body)} chars")
            return {
                "status": "simulated",
                "delivery_mode": "simulation",
                "recipient": recipient,
                "subject": subject,
                "notice": "To send actual emails to inbox, configure SMTP_USER and SMTP_PASSWORD in backend .env file."
            }

    async def send_email(self, recipient: str, subject: str, body: str, cc: Optional[str] = None) -> dict:
        return await asyncio.to_thread(self._send_smtp_sync, recipient, subject, body, cc)

import os
email_service = RealEmailService()
