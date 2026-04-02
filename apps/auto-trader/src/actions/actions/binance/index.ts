import binance_spot_get_ticker from './binance-spot-get-ticker';
import binance_spot_get_klines from './binance-spot-get-klines';
import binance_um_futures_get_ticker from './binance-um-features-get-ticker';
import binance_um_features_exchange_info from './binance-um-features-exchange-info';

export default {
    binance_spot_get_ticker: {
        method: binance_spot_get_ticker    
    },
    binance_spot_get_klines: {
        method: binance_spot_get_klines
    },
    binance_um_futures_get_ticker: {
        method: binance_um_futures_get_ticker
    },
    binance_um_features_exchange_info: {
        method: binance_um_features_exchange_info
    }
}