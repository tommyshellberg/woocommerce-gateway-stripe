jQuery( function( $ ) {
	'use strict';

	/**
	 * Object to handle Stripe admin functions.
	 */
	var wc_stripe_admin = {
		isTestMode: function() {
			return $( '#woocommerce_stripe_testmode' ).is( ':checked' );
		},

		getSecretKey: function() {
			if ( wc_stripe_admin.isTestMode() ) {
				return $( '#woocommerce_stripe_test_secret_key' ).val();
			} else {
				return $( '#woocommerce_stripe_secret_key' ).val();
			}
		},

		oauthInit: function() {
			$.ajax( {
				data:    { nonce: woocommerce_stripe_admin.wc_stripe_oauth_nonce },
				method:  'POST',
				url:     woocommerce_stripe_admin.ajax_url,
			} ).done( function( response ) {
				if ( response.success ) {
					window.location.href = response.data;
				} else {
					$( '#mainform h2' ).prepend( '<div class="notice notice-error"><p>' + response.data + '</p></div>' );
				}
			} );
		},

		/**
		 * Initialize.
		 */
		init: function() {
			$( document.body ).on( 'change', '#woocommerce_stripe_testmode', function() {
				var test_secret_key = $( '#woocommerce_stripe_test_secret_key' ).parents( 'tr' ).eq( 0 ),
					test_publishable_key = $( '#woocommerce_stripe_test_publishable_key' ).parents( 'tr' ).eq( 0 ),
					test_webhook_secret = $( '#woocommerce_stripe_test_webhook_secret' ).parents( 'tr' ).eq( 0 ),
					live_secret_key = $( '#woocommerce_stripe_secret_key' ).parents( 'tr' ).eq( 0 ),
					live_publishable_key = $( '#woocommerce_stripe_publishable_key' ).parents( 'tr' ).eq( 0 ),
					live_webhook_secret = $( '#woocommerce_stripe_webhook_secret' ).parents( 'tr' ).eq( 0 );

				if ( $( this ).is( ':checked' ) ) {
					test_secret_key.show();
					test_publishable_key.show();
					test_webhook_secret.show();
					live_secret_key.hide();
					live_publishable_key.hide();
					live_webhook_secret.hide();
				} else {
					test_secret_key.hide();
					test_publishable_key.hide();
					test_webhook_secret.hide();
					live_secret_key.show();
					live_publishable_key.show();
					live_webhook_secret.show();
				}
			} );

			$( '#woocommerce_stripe_testmode' ).change();

			// Toggle Payment Request buttons settings.
			$( '#woocommerce_stripe_payment_request' ).change( function() {
				if ( $( this ).is( ':checked' ) ) {
					$( '#woocommerce_stripe_payment_request_button_theme, #woocommerce_stripe_payment_request_button_type, #woocommerce_stripe_payment_request_button_height' ).closest( 'tr' ).show();
				} else {
					$( '#woocommerce_stripe_payment_request_button_theme, #woocommerce_stripe_payment_request_button_type, #woocommerce_stripe_payment_request_button_height' ).closest( 'tr' ).hide();
				}
			} ).change();

			// Toggle Custom Payment Request configs.
			$( '#woocommerce_stripe_payment_request_button_type' ).change( function() {
				if ( 'custom' === $( this ).val() ) {
					$( '#woocommerce_stripe_payment_request_button_label' ).closest( 'tr' ).show();
				} else {
					$( '#woocommerce_stripe_payment_request_button_label' ).closest( 'tr' ).hide();
				}
			} ).change()

			// Toggle Branded Payment Request configs.
			$( '#woocommerce_stripe_payment_request_button_type' ).change( function() {
				if ( 'branded' === $( this ).val() ) {
					$( '#woocommerce_stripe_payment_request_button_branded_type' ).closest( 'tr' ).show();
				} else {
					$( '#woocommerce_stripe_payment_request_button_branded_type' ).closest( 'tr' ).hide();
				}
			} ).change()

			// Make the 3DS notice dismissable.
			$( '.wc-stripe-3ds-missing' ).each( function() {
				var $setting = $( this );

				$setting.find( '.notice-dismiss' ).on( 'click.wc-stripe-dismiss-notice', function() {
					$.ajax( {
						type: 'head',
						url: window.location.href + '&stripe_dismiss_3ds=' + $setting.data( 'nonce' ),
					} );
				} );
			} );

			// Add Stripe Connect oauth link if not connected.
			if ( woocommerce_stripe_admin.wc_stripe_oauth_init ) {
				var oauth_init_text = $( '<p>' + woocommerce_stripe_admin.i18n.wc_stripe_oauth_text + '</p>' );

				$( '#woocommerce_stripe_enabled' ).parents( 'table' ).eq( 0 ).prepend( oauth_init_text );
				
				$( '#oauth-init' ).on( 'click', function( e ) {
					e.preventDefault();
					wc_stripe_admin.oauthInit();
				} );

			}
		}
	};

	wc_stripe_admin.init();
} );
