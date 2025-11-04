import smtplib
from email.mime.text import MIMEText

def send_email(to_email, subject, message):
    sender_email = "tu_correo@gmail.com"
    sender_password = "tu_contraseña_o_contraseña_de_app"

    msg = MIMEText(message)
    msg['Subject'] = subject
    msg['From'] = sender_email
    msg['To'] = to_email

    try:
        with smtplib.SMTP('smtp.gmail.com', 587) as server:
            server.starttls()
            server.login(sender_email, sender_password)
            server.sendmail(sender_email, to_email, msg.as_string())
            print("📧 Correo enviado con éxito a", to_email)
    except Exception as e:
        print("Error al enviar el correo:", e)
