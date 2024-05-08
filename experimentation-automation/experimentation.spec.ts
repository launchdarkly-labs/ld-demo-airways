import { test } from "@playwright/test";
import { shouldClickRegister, shouldEnroll } from "./fixture";

const iterationCount = 1000;

const setup = (test: any) => test.setTimeout(90000);
setup(test);

for (let iteration = 0; iteration < iterationCount; iteration++) {
  test(`iteration: ${iteration}`, async ({ page }) => {
  
    await page.goto("http://localhost:3000/");

    await page.click('button.signin')

    console.log("signin clicked")

    // Wait for products to load
    await page.waitForSelector('.prodcard', { timeout: 60000 });

    // Check if any products have the "to-label"
    const labeledProduct = await page.$('.enrollbutton');

    if (!labeledProduct) {
      console.log(`Iteration: ${iteration}, No products with labels present. Exiting iteration.`);
      return; // Exit the current iteration of the test if no labeled products are found
    }

    // If a labeled product is found, continue with the test logic
    const labelAccent = await labeledProduct.textContent() || "none";
    console.log(labelAccent)
    const register = shouldClickRegister({ label: labelAccent });
    const enroll = register && shouldEnroll();  // Notice the change here, we aren't passing the label anymore

if (register) {
    console.log("time to register")
    await page.click('button.enrollbutton')
    await page.waitForTimeout(1000);
  if (enroll) {
    console.log("time to enroll") 
    await page.click('button.confirmenroll');
    await page.waitForTimeout(1000)
  }
}
    // Logging to see the actions taken
    console.log(`Iteration: ${iteration}`);
  })
}