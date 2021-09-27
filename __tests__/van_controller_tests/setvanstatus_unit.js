const mongoose = require('mongoose')

const vanController = require("../../controllers/vanController")
const van = require("../../models/van");
const Van = van.Van

// defining a test suite for testing the updateVanStatus
describe("Unit testing for  updateVanStatus from vanController.js", () => {

    const req = {
        // searching for Van in my database
        session: {van_name:'Niceday'}
    };

    const res = {
        render: jest.fn()
    };

    beforeAll(() => {
        res.render.mockClear();
        
        Van.findOne = jest.fn().mockResolvedValue([
            {
            VanId: 'Niceday',
            status: 'close',
            }
        ]);
        
        Van.findOne.mockImplementationOnce(() => ({
            lean: jest.fn().mockReturnValue({
                VanId: 'Niceday',
                status: 'close',
            }),
        }));

        // mock update one
        Van.updateOne = jest.fn().mockResolvedValue([
            {
            VanId: 'Niceday',
            }
        ], );
        
        Van.updateOne.mockImplementationOnce(() => ({
            lean: jest.fn().mockReturnValue({
                VanId: 'Niceday',
            }),
        }));
        
        // mock find one again
        Van.findOne.mockImplementationOnce(() => ({
            lean: jest.fn().mockReturnValue({
                VanId: 'Niceday',
                status: 'open',
            }),
        }));
        
        vanController.updateVanStatus(req, res);
        });

        test("Test case 1: testing with status updated of \
        Niceday, expecting Niceday's status has been updated", () => {   
        expect(Van.findOne).toHaveBeenCalledTimes(2); 
        expect(Van.updateOne).toHaveBeenCalledTimes(1); 
        expect(res.render).toHaveBeenCalledTimes(1);
        // as the van's status is updated, we expect Van.findOne to be correct
        // (has been updated by Van.updateOne)
        expect(res.render).toHaveBeenCalledWith('showVanStatus', {"oneVan": {
            "VanId": "Niceday",
            "status": "open"}, 
            "layout": 'vendor_main.hbs'
        });
        });
      
  });


//   defining a test suite for testing the updateVanStatus
describe("Unit testing updateVanStatus from vanController.js with invalid van", () => {
    
    const req = {
        // searching for van in my database
        session: {van_name:'1234'}
    };

    const res = {
        render: jest.fn()
    };

    beforeAll(() => {
        // clear the render method 
        res.render.mockClear();

        Van.findOne = jest.fn().mockResolvedValue();
        // find an error, throw new error
        Van.findOne.mockImplementationOnce(() => {
            throw new Error();
          });
        // And, we call the getOneFood with the mocked
        // request and response objects!
        vanController.updateVanStatus(req, res);
      });

    test("Test case 2: testing with invalid van id \
        , expecting error message", () => {      
        expect(res.render).toHaveBeenCalledTimes(1);
        expect(res.render).toHaveBeenCalledWith('error', {"errorCode": 404,
        "message": "Error: Van not found!"});
    });
  }
  );