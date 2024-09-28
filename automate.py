from selenium import webdriver
from selenium.webdriver.common.by import By
import pytesseract
import numpy as np
from PIL import Image
import time
import base64
from io import BytesIO

# Set up Tesseract path (change this to your installation path)
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

# Set up the ChromeDriver
driver = webdriver.Chrome()

# Open the local web application
driver.get("https://captcha-automation.vercel.app/")  # Update to your local URL

# Give the page some time to load
time.sleep(2)

# Fill in the username and password
name_field = driver.find_element(By.XPATH, "//input[@id='username']")
name_field.clear()
name_field.send_keys('atul')

email_field = driver.find_element(By.XPATH, "//input[@id='password']")
email_field.clear()
email_field.send_keys('password')

# Get the CAPTCHA canvas element
captcha_canvas = driver.find_element(By.CLASS_NAME, "captchaCanvas")

# Use JavaScript to get the image data from the canvas
captcha_image_data = driver.execute_script("return arguments[0].toDataURL('image/png').substring(21);", captcha_canvas)

# Decode the base64 image data
captcha_image_data = base64.b64decode(captcha_image_data)

# Use BytesIO to process the image directly in memory
captcha_image = Image.open(BytesIO(captcha_image_data))

# Use Tesseract to detect text in the CAPTCHA image
captcha_text = pytesseract.image_to_string(captcha_image)

# Enter the CAPTCHA text into the input field
captcha_field = driver.find_element(By.XPATH, "//input[@placeholder='Enter CAPTCHA']")
captcha_field.clear()
captcha_field.send_keys(captcha_text.strip())

# Click the "Continue" button
continue_button = driver.find_element(By.XPATH, "//button[text()='Login']")
continue_button.click()

# Wait for OTP input to be visible
time.sleep(5)  # Adjust as necessary

driver.quit()
