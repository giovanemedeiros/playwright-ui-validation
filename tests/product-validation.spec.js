const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

// Helper Function
function getNextUserNumber() {
  const filePath = path.resolve('counter.json');
  let currentNumber = 1;

  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, 'utf-8');
    currentNumber = JSON.parse(data).count || 1;
  }

  // Writes the next number (+1) to counter.json file
  fs.writeFileSync(filePath, JSON.stringify({ count: currentNumber + 1 }, null, 2));
  return currentNumber;
}

test.describe('Product Validation - Serverest', () => {

  // ---- [US01] [UI Validation] Cadastrar produto com sucesso como Administrador ----
  test('Should register a new product successfully as Administrator', async ({ page, request }) => {
    
    // Get incremental number and create user via API
    const userNumber = getNextUserNumber();
    const randomUser = `testqap3v${userNumber}`;
    const randomEmail = `testqap3v${userNumber}@email.com`;
    
    // Silent user registration via API (Background)
    await request.post('https://serverest.dev/usuarios', {
      data: {
        nome: randomUser,
        email: randomEmail,
        password: 'testqa26',
        administrador: 'true'
      }
    });

    // UI visual test on login page
    await page.goto('https://front.serverest.dev/login');
    await page.getByTestId('email').fill(randomEmail);
    await page.getByTestId('senha').fill('testqa26');
    await page.getByTestId('entrar').click();
    
    // Validate successful login
    await expect(page).toHaveURL('https://front.serverest.dev/admin/home');
    await expect(page.getByText(/bem vindo/i)).toBeVisible();

    const productName = `Produto ${userNumber}`;
    const productDescription = `Teste - Produto ${userNumber}`;

    await page.getByTestId('cadastrar-produtos').click();
    await page.getByTestId('nome').fill(productName);
    await page.getByTestId('preco').fill('100');
    await page.getByTestId('descricao').fill(productDescription);
    await page.getByTestId('quantity').fill('10');
    
    // Upload the file for product image
    await page.getByTestId('imagem').setInputFiles({
      name: 'product-image.png',
      mimeType: 'image/png',
      buffer: Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        'base64'
      )
    });
    await page.getByTestId('cadastarProdutos').click();

    // Assert product is registered and displayed on product list page
    await expect(page).toHaveURL('https://front.serverest.dev/admin/listarprodutos');
    await expect(page.getByText(productName, { exact: true })).toBeVisible();
  });

  // ---- [US02] [UI Validation] Validar restrição de campos obrigatórios no cadastro de produto ----
  test('Should validate restriction of mandatory fields in product registration', async ({ page, request }) => {
          
    // Get incremental number and create user via API
    const userNumber = getNextUserNumber();
    const randomUser = `testqap3v${userNumber}`;
    const randomEmail = `testqap3v${userNumber}@email.com`;
    
    // Silent user registration via API (Background)
    await request.post('https://serverest.dev/usuarios', {
      data: {
        nome: randomUser,
        email: randomEmail,
        password: 'testqa26',
        administrador: 'true'
      }
    });

    // UI visual test on login page
    await page.goto('https://front.serverest.dev/login');
    await page.getByTestId('email').fill(randomEmail);
    await page.getByTestId('senha').fill('testqa26');
    await page.getByTestId('entrar').click();
    
    // Validate successful login
    await expect(page).toHaveURL('https://front.serverest.dev/admin/home');
    await expect(page.getByText(/bem vindo/i)).toBeVisible();

    // Navigate to product registration
    await page.getByTestId('cadastrar-produtos').click();
    
    // Confirm product registration
    await page.getByTestId('cadastarProdutos').click();

    // Warnings expected
    await expect(page.getByText('Nome é obrigatório')).toBeVisible();
    await expect(page.getByText('Preco é obrigatório')).toBeVisible();
    await expect(page.getByText('Descricao é obrigatório')).toBeVisible();
    await expect(page.getByText('Quantidade é obrigatório')).toBeVisible();
  });
  
  // ---- [US03] [UI Validation] Validar restrição de preço zero ou negativo ----
  test('Should validate restriction of zero or negative price', async ({ page }) => {
    
  });

  // ---- [US04] [UI Validation] Validar restrição de quantidade negativa ----
  test('Should validate restriction of negative quantity', async ({ page }) => {
    
  });

  // ---- [US05] [UI Validation] Validar restrição de produto com nome duplicado ----
  test('Should validate restriction of duplicate product name', async ({ page }) => {
    
  });

});
  