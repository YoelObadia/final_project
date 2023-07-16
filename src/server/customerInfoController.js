exports.getCustomerInfo = (req, res) => {
    // Logique pour obtenir les informations sur un client côté admin
    const { customerId } = req.params;
    res.send(`Customer Info for ID ${customerId}`);
  };
  