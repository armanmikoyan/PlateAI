import { Router } from 'express';
import type { ServerConfig } from '@/types.js';

import {
  getAuthenticatedUser,
  getStore,
  listStores,
  lemonSqueezySetup,
  createCheckout,
  getProduct,
  listProducts,
  listVariants,
} from '@lemonsqueezy/lemonsqueezy.js';
import { PAYMENT_ROUTES } from './constants.js';

export function createPaymentRouter(config: ServerConfig): Router {
  const router = Router();

  lemonSqueezySetup({
    apiKey: config.LEMON_SQUEEZY_API_KEY,
    onError: error => console.error('Error!', error),
  });

  router.get(`/`, async (req, res) => {
    // const { data: authData, error: authError } = await getAuthenticatedUser();
    // const { data: storeData, error: storeError } = await getStore('451114');
    // const { data: productData, error: productError } = await getProduct(1317716);
    // const { data: listStores, error: listStoresError } = await listStores();
    // const { data: listProductsData, error: listProductsError } = await listProducts();
    // const { data: listVariantsData, error: listVariantsError } = await listVariants({
    //   filter: { productId: 1317716 },
    // });
    const { data: checkoutData, error: checkoutError } = await createCheckout(451114, 2060965, {
      productOptions: {
        enabledVariants: [2060965],
        redirectUrl: 'https://plateai.fit/#faq',
      },
    });

    // console.log(authData);
    // console.log(storeData);
    // console.log(productData);
    // console.log(listProductsData);
    // console.log(listStores);
    // console.log(listVariantsData?.data);
    console.log(checkoutData);

    res.status(200).end('Logged successfully\n');
  });

  return router;
}
