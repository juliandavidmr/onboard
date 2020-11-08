import { Pin } from "../";

describe('Pin', () => {

  test('Pin initialization', () => {
    const pin = new Pin(1, 'pin_text');
    expect(pin).toBeDefined();
  });
})

