const request = require('supertest');
const app = require('../../app'); // the express server

/*
    Test Suite for testing set van status functionality:         
*/
describe('Integration test: set van status', () => {
    // we need to use request.agent so that we can create and
    // use sessions
    let agent = request.agent(app);
    // store cookie returned by our app. 
    // If the API server returns a token instead, we will 
    // store the token
    let cookie = null;

    beforeAll(() => agent
        // send a POST request to login
        .post('/vendor/login')
        .set('Content-Type', 'application/json')
        // send the username and password
        .send({
            van_name: 'Niceday',
            van_password: '12345',
        })

        .then((res) => {
            cookie = res
                .headers['set-cookie'][0]
                .split(',')
                .map(item => item.split(';')[0])
                .join(';')
        })
    );

    // Test Case 1 with valid van
    test('Test 1 (lookup valid van): Niceday', () => {
        return agent
            .post('/vendor/home/updateVanStatus')
            .set('Cookie', cookie)
            .then((response) => {
                expect(response.statusCode).toBe(200);
                expect(response.text).toContain('<h1>The status of van is now changed!</h1>');
            });
    });

});