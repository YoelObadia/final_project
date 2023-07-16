exports.getAccount = (req, res) => {
    // Logique pour obtenir le compte d'un client côté admin
    const { customerId } = req.params;
    res.send(`Customer Account for ID ${customerId}`);
  };
  