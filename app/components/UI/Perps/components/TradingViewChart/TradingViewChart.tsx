/* eslint-disable @metamask/design-tokens/color-no-hex */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { WebView, WebViewMessageEvent } from '@metamask/react-native-webview';
import { Box, Text, TextVariant } from '@metamask/design-system-react-native';
import { useStyles } from '../../../../../component-library/hooks';
import { styleSheet } from './TradingViewChart.styles';
import type { CandleData } from '../../types';
import { TradingViewChartSelectorsIDs } from '../../../../../../e2e/selectors/Perps/Perps.selectors';
import DevLogger from '../../../../../core/SDKConnect/utils/DevLogger';
import { createTradingViewChartTemplate } from './TradingViewChartTemplate';
export interface TPSLLines {
  takeProfitPrice?: string;
  stopLossPrice?: string;
  entryPrice?: string;
  liquidationPrice?: string;
  currentPrice?: string;
}

export type { TimeDuration } from '../../constants/chartConfig';

interface TradingViewChartProps {
  candleData?: CandleData | null;
  height?: number;
  tpslLines?: TPSLLines;
  onChartReady?: () => void;
  testID?: string;
}

// ATTRIBUTION NOTICE:
// TradingView Lightweight Charts™
// Copyright (с) 2025 TradingView, Inc. https://www.tradingview.com/
const TradingViewChart: React.FC<TradingViewChartProps> = ({
  candleData,
  height = 350,
  tpslLines,
  onChartReady,
  testID,
}) => {
  const { styles, theme } = useStyles(styleSheet, {});
  const webViewRef = useRef<WebView>(null);
  const [isChartReady, setIsChartReady] = useState(false);
  const [webViewError, setWebViewError] = useState<string | null>(null);
  const [webViewLoaded, setWebViewLoaded] = useState(false);
  const chartTimeoutRef = useRef<NodeJS.Timeout>();
  const initialDataSentRef = useRef(false);
  const previousIntervalRef = useRef<string | null>(null);

  const htmlContent = useMemo(() => {
    const template = createTradingViewChartTemplate(theme);
    console.log('📄 HTML template created, length:', template.length);
    return template;
  }, [theme]);

  // Debug component mounting
  useEffect(() => {
    console.log('🏗️ TradingViewChart component mounted');
    console.log('📋 Initial state:', {
      isChartReady,
      webViewLoaded,
      hasTheme: !!theme,
    });
  }, []);

  // Force log to track WebView state changes
  useEffect(() => {
    console.log('🔄 WebView state changed:', { webViewLoaded, isChartReady });
  }, [webViewLoaded, isChartReady]);

  // Send message to WebView - simplified to avoid loops
  const sendMessage = useCallback(
    (message: object) => {
      if (webViewRef.current && isChartReady) {
        webViewRef.current.postMessage(JSON.stringify(message));
      }
    },
    [isChartReady],
  );

  // Handle messages from WebView
  const handleWebViewMessage = useCallback(
    (event: WebViewMessageEvent) => {
      console.log('📨 RAW MESSAGE RECEIVED from WebView!');
      console.log('📨 Message data:', event.nativeEvent.data);

      try {
        const message = JSON.parse(event.nativeEvent.data);
        console.log('📨 Parsed message:', message);

        switch (message.type) {
          case 'CHART_READY':
            console.log(
              '✅ CHART_READY received - chart initialized successfully!',
            );
            setIsChartReady(true);
            // Reset data sent flag so we can send initial data to new chart
            initialDataSentRef.current = false;

            // Clear timeout since chart is ready
            if (chartTimeoutRef.current) {
              clearTimeout(chartTimeoutRef.current);
              console.log('⏰ Chart timeout cleared');
            }

            onChartReady?.();
            break;
          case 'WEBVIEW_TEST':
            console.log('🧪 WebView communication test successful:', message);
            break;
          case 'WEBVIEW_ERROR':
            console.error('💥 WebView JavaScript error:', message.error);
            if (message.details)
              console.error('Error details:', message.details);
            if (message.stack) console.error('Error stack:', message.stack);
            break;
          case 'PRICE_LINES_UPDATE':
            break;
          case 'INTERVAL_UPDATED':
            break;
          default:
            console.log('🤷 Unknown message type:', message.type, message);
            break;
        }
      } catch (error) {
        console.error(
          '❌ Error parsing WebView message:',
          error,
          'Raw data:',
          event.nativeEvent.data,
        );
      }
    },
    [onChartReady],
  );

  // Convert CandleData to format expected by TradingView Lightweight Charts
  const formatCandleData = useCallback((data: CandleData) => {
    if (!data?.candles) return [];

    const formatted = data.candles
      .map((candle) => {
        // TradingView expects Unix timestamp in SECONDS for intraday data
        // Our data comes in milliseconds, so divide by 1000
        const timeInSeconds = Math.floor(candle.time / 1000);

        const formattedCandle = {
          time: timeInSeconds,
          open: parseFloat(candle.open),
          high: parseFloat(candle.high),
          low: parseFloat(candle.low),
          close: parseFloat(candle.close),
        };

        // Validate all values are valid numbers
        const isValid =
          !isNaN(formattedCandle.time) &&
          !isNaN(formattedCandle.open) &&
          !isNaN(formattedCandle.high) &&
          !isNaN(formattedCandle.low) &&
          !isNaN(formattedCandle.close) &&
          formattedCandle.open > 0 &&
          formattedCandle.high > 0 &&
          formattedCandle.low > 0 &&
          formattedCandle.close > 0;

        if (!isValid) {
          DevLogger.log(
            '🚨 Invalid candle data:',
            candle,
            '→',
            formattedCandle,
          );
          return null;
        }

        return formattedCandle;
      })
      .filter((candle): candle is NonNullable<typeof candle> => candle !== null)
      .sort((a, b) => a.time - b.time); // Sort by time ascending

    return formatted;
  }, []);

  // Memoize the candle data to prevent infinite loops
  const candleDataVersion = useMemo(() => {
    if (!candleData?.candles) return null;
    return {
      coin: candleData.coin,
      interval: candleData.interval,
      candlesCount: candleData.candles.length,
      firstTime: candleData.candles[0]?.time,
      lastTime: candleData.candles[candleData.candles.length - 1]?.time,
    };
  }, [candleData]);

  // WebView load handlers
  const handleWebViewLoad = useCallback(() => {
    console.log('✅ WebView onLoad event fired!');
    console.log('🔄 Setting webViewLoaded to true');
    setWebViewLoaded(true);

    // Start a timeout to detect if chart never becomes ready
    if (chartTimeoutRef.current) {
      clearTimeout(chartTimeoutRef.current);
    }

    chartTimeoutRef.current = setTimeout(() => {
      if (!isChartReady) {
        console.error(
          '⏰ Chart initialization timeout - chart never became ready after 10 seconds',
        );
        console.log('🔍 Debugging info:', {
          webViewLoaded: true,
          isChartReady: false,
          hasWebViewRef: !!webViewRef.current,
          timestamp: new Date().toISOString(),
        });
      }
    }, 10000); // 10 second timeout
  }, [isChartReady]);

  const handleWebViewLoadStart = useCallback(() => {
    console.log('🚀 WebView onLoadStart event fired!');
    console.log('🔄 Setting webViewLoaded to false');
    setWebViewLoaded(false);
    setIsChartReady(false);
  }, []);

  const handleWebViewLoadEnd = useCallback(() => {
    console.log('🏁 WebView onLoadEnd event fired!');
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (chartTimeoutRef.current) {
        clearTimeout(chartTimeoutRef.current);
      }
    };
  }, []);

  // Send candle data to chart (with smart view preservation)
  useEffect(() => {
    const currentInterval = candleData?.interval;
    const intervalChanged =
      previousIntervalRef.current !== null &&
      previousIntervalRef.current !== currentInterval;

    // Reset flags when interval changes to allow refitting
    if (intervalChanged) {
      console.log('🔄 Interval changed:', {
        from: previousIntervalRef.current,
        to: currentInterval,
      });
      initialDataSentRef.current = false;

      // Reset chart data flag in WebView so it refits content
      if (webViewRef.current) {
        webViewRef.current.postMessage(
          JSON.stringify({
            type: 'RESET_CHART_DATA_FLAG',
          }),
        );
      }
    }

    // Update the previous interval
    previousIntervalRef.current = currentInterval || null;

    console.log('📊 Data send effect:', {
      isChartReady,
      hasWebView: !!webViewRef.current,
      hasCandleData: !!candleData?.candles?.length,
      webViewLoaded,
      initialDataSent: initialDataSentRef.current,
      intervalChanged,
      currentInterval,
    });

    if (
      !isChartReady ||
      !webViewRef.current ||
      (!intervalChanged && initialDataSentRef.current)
    ) {
      console.log('⚠️ Not ready to send data or already sent:', {
        isChartReady,
        hasWebView: !!webViewRef.current,
        alreadySent: initialDataSentRef.current,
        intervalChanged,
      });
      return;
    }

    let dataToSend = null;
    let dataSource = 'none';

    // Prioritize real data over sample data
    if (candleData?.candles && candleData.candles.length > 0) {
      dataToSend = formatCandleData(candleData);
      dataSource = 'real';
      console.log('📤 Sending chart data:', {
        count: dataToSend.length,
        intervalChanged,
        willRefit: intervalChanged || !initialDataSentRef.current,
      });
    }

    if (dataToSend) {
      const message = {
        type: 'SET_CANDLESTICK_DATA',
        data: dataToSend,
        source: dataSource,
        shouldRefit: intervalChanged || !initialDataSentRef.current, // Tell chart whether to refit
      };
      webViewRef.current.postMessage(JSON.stringify(message));
      initialDataSentRef.current = true; // Mark as sent

      if (intervalChanged) {
        console.log('✅ Chart data sent with refit for interval change');
      } else {
        console.log(
          '✅ Initial chart data sent, future updates will preserve view',
        );
      }
    }
  }, [isChartReady, candleData]);

  // Update auxiliary lines when they change
  useEffect(() => {
    if (isChartReady && tpslLines) {
      sendMessage({
        type: 'ADD_AUXILIARY_LINES',
        lines: tpslLines,
      });
    }
  }, [tpslLines, isChartReady, sendMessage]);

  // Handle WebView errors
  const handleWebViewError = useCallback(
    (event: { nativeEvent?: { description?: string } }) => {
      console.error('❌ WebView load error:', event.nativeEvent);
      const errorDescription =
        event.nativeEvent?.description || 'WebView error occurred';
      setWebViewError(errorDescription);
      setWebViewLoaded(false);
      setIsChartReady(false);
    },
    [],
  );

  if (webViewError) {
    return (
      <Box
        twClassName="flex-1 items-center justify-center bg-error-muted"
        style={{ height }}
        testID={`${testID}-error`}
      >
        <Text variant={TextVariant.BodyMd}>Chart Error: {webViewError}</Text>
      </Box>
    );
  }

  // Debug rendering
  console.log('🖼️ Rendering TradingViewChart:', {
    hasError: !!webViewError,
    height,
    htmlLength: htmlContent.length,
  });

  return (
    <Box
      twClassName="bg-default rounded-lg"
      testID={testID || TradingViewChartSelectorsIDs.CONTAINER}
    >
      {/* Chart WebView */}
      <Box
        twClassName="overflow-hidden rounded-lg"
        style={{ height, width: '100%', minHeight: height }} // eslint-disable-line react-native/no-inline-styles
      >
        <WebView
          ref={webViewRef}
          source={{
            html: `
              <!DOCTYPE html>
              <html>
                <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <style>
                    body { margin: 0; padding: 0; background: ${theme.colors.background.default}; color: ${theme.colors.text.default}; font-family: Arial; }
                    #container { width: 100%; height: 100vh; }
                    #status { position: absolute; top: 10px; left: 10px; z-index: 1000; font-size: 12px; color: ${theme.colors.text.muted}; }
                  </style>
                </head>
                <body>
                  <div id="container"></div>
                  <p id="status">Loading TradingView chart...</p>
                  
                  <script>
                    console.log('📊 TradingView Chart HTML Script Starting...');
                    
                    // Global variables
                    window.chart = null;
                    window.candlestickSeries = null;
                    window.chartHasData = false;
                    
                    // Helper function to send messages to React Native
                    function sendMessage(message) {
                      if (window.ReactNativeWebView) {
                        console.log('📤 Sending message:', message.type);
                        window.ReactNativeWebView.postMessage(JSON.stringify(message));
                      }
                    }
                    
                    // Update status on screen
                    function updateStatus(text) {
                      const statusEl = document.getElementById('status');
                      if (statusEl) {
                        statusEl.textContent = text;
                      }
                      console.log('📊 Status:', text);
                    }
                    
                    // Load TradingView library
                    function loadTradingView() {
                      updateStatus('Loading TradingView library...');
                      
                      const script = document.createElement('script');
                      script.src = 'https://unpkg.com/lightweight-charts/dist/lightweight-charts.standalone.production.js';
                      
                      script.onload = function() {
                        console.log('✅ TradingView library loaded');
                        updateStatus('TradingView library loaded - creating chart...');
                        setTimeout(createChart, 500);
                      };
                      
                      script.onerror = function(error) {
                        console.error('❌ Failed to load TradingView library');
                        updateStatus('Failed to load TradingView library');
                        sendMessage({
                          type: 'WEBVIEW_ERROR',
                          error: 'Failed to load TradingView library',
                          timestamp: new Date().toISOString()
                        });
                      };
                      
                      document.head.appendChild(script);
                    }
                    
                    // Create the chart
                    function createChart() {
                      try {
                        const container = document.getElementById('container');
                        if (!container) {
                          throw new Error('Container not found');
                        }
                        
                        if (!window.LightweightCharts) {
                          throw new Error('LightweightCharts not available');
                        }
                        
                        updateStatus('Creating chart instance...');
                        
                        // Create chart with proper theme colors
                        const chart = window.LightweightCharts.createChart(container, {
                          width: window.innerWidth,
                          height: window.innerHeight,
                          layout: {
                            background: {
                              color: '${theme.colors.background.default}',
                            },
                            textColor: '${theme.colors.text.muted}',
                            attributionLogo: false, // Hide the TradingView logo
                          },
                          localization: {
                            priceFormatter: (price) => {
                              // Format price with comma separators
                              return new Intl.NumberFormat('en-US', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                              }).format(price);
                            }
                          },
                          grid: {
                            vertLines: { color: '${theme.colors.border.muted}' },
                            horzLines: { color: '${theme.colors.border.muted}' },
                          },
                          timeScale: {
                            timeVisible: true,
                            secondsVisible: false,
                            borderColor: 'transparent',
                          },
                          rightPriceScale: {
                            borderColor: 'transparent',
                          },
                          leftPriceScale: {
                            borderColor: 'transparent',
                          },
                        });
                        
                        // Store chart reference globally and reset data flag
                        window.chart = chart;
                        window.chartHasData = false;
                        
                        console.log('✅ Chart created successfully');
                        updateStatus('Chart created successfully!');
                        
                        // Send CHART_READY message to React Native
                        sendMessage({
                          type: 'CHART_READY',
                          timestamp: new Date().toISOString()
                        });
                        
                        // Hide status after success
                        setTimeout(() => {
                          const statusEl = document.getElementById('status');
                          if (statusEl) statusEl.style.display = 'none';
                        }, 2000);
                        
                      } catch (error) {
                        console.error('❌ Error creating chart:', error);
                        updateStatus('Error creating chart: ' + error.message);
                        sendMessage({
                          type: 'WEBVIEW_ERROR',
                          error: 'Chart creation failed',
                          details: error.message,
                          timestamp: new Date().toISOString()
                        });
                      }
                    }
                    
                    // Create candlestick series
                    function createCandlestickSeries() {
                      if (!window.chart || !window.LightweightCharts) return null;
                      
                      console.log('📊 Creating candlestick series...');
                      
                      // Remove existing series if it exists
                      if (window.candlestickSeries) {
                        window.chart.removeSeries(window.candlestickSeries);
                      }
                      
                      // Create new candlestick series with theme colors
                      window.candlestickSeries = window.chart.addSeries(window.LightweightCharts.CandlestickSeries, {
                        upColor: '#BAF24A',
                        downColor: '#FF7584',
                        borderVisible: false,
                        wickUpColor: '#BAF24A',
                        wickDownColor: '#FF7584',
                        priceLineColor: '${theme.colors.text.default}',
                        priceLineWidth: 1,
                        lastValueVisible: true,
                        title: 'Current',
                      });
                      
                      console.log('✅ Candlestick series created');
                      return window.candlestickSeries;
                    }
                    
                    // Handle messages from React Native
                    window.addEventListener('message', function(event) {
                      try {
                        const message = JSON.parse(event.data);
                        console.log('📨 Received message:', message.type);
                        
                        switch (message.type) {
                          case 'RESET_CHART_DATA_FLAG':
                            window.chartHasData = false;
                            console.log('🔄 Chart data flag reset - next data will refit view');
                            break;
                            
                          case 'SET_CANDLESTICK_DATA':
                            if (window.chart && message.data && message.data.length > 0) {
                              console.log('📊 Setting candlestick data, count:', message.data.length);
                              
                              // Create candlestick series if it doesn't exist
                              if (!window.candlestickSeries) {
                                createCandlestickSeries();
                              }
                              
                              if (window.candlestickSeries) {
                                window.candlestickSeries.setData(message.data);
                                
                                // Fit content when explicitly requested (interval changes) or initial load
                                const shouldFitContent = message.shouldRefit || !window.chartHasData;
                                if (shouldFitContent) {
                                  window.chart.timeScale().fitContent();
                                  window.chartHasData = true;
                                  if (message.shouldRefit) {
                                    console.log('📊 Data updated with refit for interval change');
                                  } else {
                                    console.log('📊 Initial data loaded - fitted content to view');
                                  }
                                } else {
                                  console.log('📊 Data updated - preserved user view state');
                                }
                                
                                console.log('✅ Candlestick data set successfully');
                                updateStatus('Chart loaded with ' + message.data.length + ' candles');
                                
                                // Hide status after displaying data
                                setTimeout(() => {
                                  const statusEl = document.getElementById('status');
                                  if (statusEl) statusEl.style.display = 'none';
                                }, 3000);
                              }
                            } else {
                              console.log('⚠️ No candlestick data provided');
                            }
                            break;
                            
                          case 'ADD_AUXILIARY_LINES':
                            // Handle TPSL lines if needed later
                            break;
                            
                          default:
                            console.log('🤷 Unknown message type:', message.type);
                            break;
                        }
                      } catch (error) {
                        console.error('❌ Error handling message:', error);
                      }
                    });
                    
                    // Also listen for React Native WebView messages (compatibility)
                    document.addEventListener('message', function(event) {
                      window.dispatchEvent(new MessageEvent('message', event));
                    });
                    
                    // Handle window resize
                    window.addEventListener('resize', function() {
                      if (window.chart) {
                        window.chart.applyOptions({
                          width: window.innerWidth,
                          height: window.innerHeight
                        });
                      }
                    });
                    
                    // Start loading immediately
                    loadTradingView();
                    
                  </script>
                </body>
              </html>
            `,
            baseUrl: '',
          }}
          style={[styles.webView, { height, width: '100%' }]} // eslint-disable-line react-native/no-inline-styles
          onMessage={handleWebViewMessage}
          onError={handleWebViewError}
          onLoad={handleWebViewLoad}
          onLoadStart={handleWebViewLoadStart}
          onLoadEnd={handleWebViewLoadEnd}
          onHttpError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.error('🌐 WebView HTTP Error:', nativeEvent);
          }}
          // iOS-specific configuration
          javaScriptEnabled={true}
          domStorageEnabled={true}
          originWhitelist={['*']}
          allowsInlineMediaPlayback={true}
          mediaPlaybackRequiresUserAction={false}
          mixedContentMode="compatibility"
          startInLoadingState={true}
          cacheEnabled={false}
          incognito={true} // This sometimes helps with iOS restrictions
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          bounces={false}
          scalesPageToFit={false}
          // iOS compatibility settings
          allowsFullscreenVideo={false}
          allowsBackForwardNavigationGestures={false}
          dataDetectorTypes="none"
          testID={`${testID || TradingViewChartSelectorsIDs.CONTAINER}-webview`}
          webviewDebuggingEnabled={__DEV__}
        />
      </Box>
    </Box>
  );
};

export default TradingViewChart;
