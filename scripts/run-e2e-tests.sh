#!/bin/bash

# Script to run E2E tests with dynamic port detection
# This automatically finds an available port to run the Vite preview server

# Build the app
echo "Building the application..."
npm run build

if [ $? -ne 0 ]; then
  echo "❌ Build failed"
  exit 1
fi

# Find an available port using our Node.js port finder
echo "Finding available port for the preview server..."
PORT=$(node scripts/find-port.js)

if [ -z "$PORT" ] || [ "$PORT" == "-1" ]; then
  echo "❌ Failed to find an available port"
  exit 1
fi

echo "Using port $PORT for the preview server"

# Start the preview server on the selected port and capture its output
echo "Starting the preview server on port $PORT..."
npx vite preview --port $PORT > preview-output.log 2>&1 &
PREVIEW_PID=$!

# Give the server time to start up
echo "Waiting for server to start..."
sleep 3

# Read the log file to verify the server started correctly
echo "Verifying server status..."
SERVER_STARTED=$(cat preview-output.log | grep -m 1 "Local:" | grep -oE 'http://localhost:[0-9]+')

if [ -z "$SERVER_STARTED" ]; then
  echo "⚠️ Could not confirm server started on expected port, checking alternate detection method..."
  
  # Provide some extra time for the server to start
  sleep 2
  
  # Check if anything is listening on our port
  SOMETHING_ON_PORT=$(lsof -i ":$PORT" | grep LISTEN | wc -l)
  if [ "$SOMETHING_ON_PORT" -gt 0 ]; then
    echo "✅ Something is running on port $PORT, assuming it's our server"
    SERVER_STARTED="http://localhost:$PORT"
  else
    echo "❌ Nothing is running on port $PORT"
    # Print the preview-output.log for debugging
    echo "Contents of preview-output.log:"
    cat preview-output.log
  fi
fi

if [ -z "$SERVER_STARTED" ]; then
  echo "❌ Failed to confirm server is running"
  echo "Killing preview server process..."
  kill $PREVIEW_PID 2>/dev/null
  exit 1
fi

echo "✅ Preview server running at $SERVER_STARTED"

# Export the port as an environment variable for WebDriver
export TEST_PORT=$PORT
export CHROME_VERSION=$(google-chrome --version | grep -oP 'Chrome \K[0-9]+')

echo "Running tests with Chrome version: $CHROME_VERSION and server port: $TEST_PORT"

# Run the integration tests
npm run test:integration

# Save the test result
TEST_RESULT=$?

# Kill the preview server
echo "Stopping preview server (PID: $PREVIEW_PID)..."
kill $PREVIEW_PID
wait $PREVIEW_PID 2>/dev/null

# Clean up the log file
rm -f preview-output.log

# Exit with the test result
echo "Tests completed with status code: $TEST_RESULT"
exit $TEST_RESULT