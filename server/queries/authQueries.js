const registerNewCustomer =
    'INSERT INTO Users (FirstName, LastName, PhoneNumber, Email, Password) VALUES (?, ?, ?, ?, ?)';

const findCustomerByEmail = `SELECT * FROM Users WHERE Email = ?`;

const getCustomerById = `SELECT * FROM Users WHERE Id = ?`;

const getCustomerIdByEmail = `SELECT Id FROM Users WHERE Email = ?`;

const updateCustomerByEmail = 
    `UPDATE Users SET FirstName = ?, LastName = ?, PhoneNumber = ?, Email = ?, Password = ? WHERE Email = ?`;

module.exports = {
    registerNewCustomer,
    findCustomerByEmail,
    getCustomerById,
    getCustomerIdByEmail,
    updateCustomerByEmail
}