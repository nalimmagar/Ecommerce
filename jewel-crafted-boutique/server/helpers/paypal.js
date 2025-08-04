const paypal = require("paypal-rest-sdk");

paypal.configure({
  mode: "sandbox",
  client_id:
    "AcMQTg3VzGHNuk7ojrwbSx6jD4m8qAvN-nRFJCpdsZ0xnzcNjbovEppanY5bAD9IxVH1ngS6KSQ0I7fk",
  client_secret:
    "EFsuepBqUlUHvE2_JmmtdbAU3PRHwMcrQosKGWK4mzjuZy7HxZ6SKwPr_VCWSFDmRDFHQ-G-oAgJl2QZ",
});

module.exports = paypal;
