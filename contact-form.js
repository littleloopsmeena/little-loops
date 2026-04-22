const enquiryForm = document.querySelector("#enquiry-form");
const formStatus = document.querySelector("#form-status");

if (enquiryForm && formStatus) {
  enquiryForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(enquiryForm);
    const payload = Object.fromEntries(formData.entries());

    formStatus.textContent = "Sending your enquiry...";
    formStatus.className = "form-status";

    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Something went wrong while sending the enquiry.");
      }

      enquiryForm.reset();
      formStatus.textContent = "Enquiry sent successfully. Meena will receive it by email and WhatsApp.";
      formStatus.className = "form-status success";
    } catch (error) {
      formStatus.textContent = error.message;
      formStatus.className = "form-status error";
    }
  });
}
