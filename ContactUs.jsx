import "./Contactus.css";

const Contact = () => {
  return (
    <section className="contact">
      <div className="contact__overlay"></div>

      <div className="contact__wrap">
        
        <div className="contact__left">
          <h2>Let’s Get In Touch.</h2>
          <p>Or just reach out manually to rado.com</p>
        </div>

       
        <div className="contact__card">
          <form className="contact__form">
            <div className="field">
              <label>Full Name</label>
              <input type="text" placeholder="Enter your full name..." />
            </div>

            <div className="field">
              <label>Email Address</label>
              <input type="email" placeholder="Enter your email..." />
            </div>

            <div className="field">
              <label>Phone Number</label>
              <input type="text" placeholder="+44 000 000 0000" />
            </div>

            <div className="field">
              <label>Message</label>
              <textarea placeholder="Enter your message..."></textarea>
            </div>

            <button className="contact__btn">Submit Form →</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;