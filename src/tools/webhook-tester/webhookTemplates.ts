import { WebhookTemplate } from './types';

export const WEBHOOK_TEMPLATES: WebhookTemplate[] = [
  {
    id: 'github-push',
    provider: 'github',
    event: 'push',
    name: 'GitHub: push',
    payload: JSON.stringify(
      {
        ref: 'refs/heads/main',
        before: '6113728f27ae82c7b1a12f6593b49a973e3fb816',
        after: '883a85047ab6c5b7e952693fb574dd2040e29b29',
        repository: {
          id: 1296269,
          name: 'Toolnest',
          full_name: 'octocat/Toolnest',
          private: false,
        },
        pusher: {
          name: 'octocat',
          email: 'octocat@github.com',
        },
      },
      null,
      2
    ),
  },
  {
    id: 'stripe-payment-succeeded',
    provider: 'stripe',
    event: 'payment_intent.succeeded',
    name: 'Stripe: payment_intent.succeeded',
    payload: JSON.stringify(
      {
        id: 'evt_1MvIF9LkdIwHu7ixT7u7ZJb1',
        object: 'event',
        type: 'payment_intent.succeeded',
        data: {
          object: {
            id: 'pi_3MvIF8LkdIwHu7ix1g93iQ8u',
            object: 'payment_intent',
            amount: 4900,
            currency: 'usd',
            status: 'succeeded',
          },
        },
      },
      null,
      2
    ),
  },
  {
    id: 'shopify-order-created',
    provider: 'shopify',
    event: 'orders/create',
    name: 'Shopify: orders/create',
    payload: JSON.stringify(
      {
        id: '820982911946154508',
        email: 'jon@example.com',
        created_at: '2026-11-24T18:00:00-05:00',
        total_price: '119.99',
        currency: 'USD',
        financial_status: 'paid',
        line_items: [
          {
            id: 8665503117664,
            title: 'Pro Developer Toolkit',
            price: '119.99',
            quantity: 1,
          },
        ],
      },
      null,
      2
    ),
  },
  {
    id: 'slack-app-mention',
    provider: 'slack',
    event: 'app_mention',
    name: 'Slack: app_mention',
    payload: JSON.stringify(
      {
        token: 'XXYYZZ',
        team_id: 'T12345678',
        api_app_id: 'A12345678',
        event: {
          type: 'app_mention',
          user: 'U12345678',
          text: '<@U12345678> review pull request',
          ts: '1732468800.000100',
          channel: 'C12345678',
        },
        type: 'event_callback',
      },
      null,
      2
    ),
  },
];
