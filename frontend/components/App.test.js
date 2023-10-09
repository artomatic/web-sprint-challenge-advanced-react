// Write your tests here
import {render, screen, act} from '@testing-library/react'
import {userEvent} from '@testing-library/user-event';
import React from 'react'
import AppFunctional from './AppFunctional';


test('sanity', () => {
  expect(true).toBe(true)
})

// test ('clicking submit with no email gives correct error message', async () => {
//   render (<AppFunctional/>);
//   userEvent.click(screen.getByRole('button', { name: 'Submit' }));
//   const message = await screen.findByText(/Ouch: email is required/i);
//   expect(message.textContent).toBe('Ouch: email is required');
// })


