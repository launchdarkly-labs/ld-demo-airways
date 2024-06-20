# Define the endpoint URL
ENDPOINT_URL="http://localhost:3000/api/airports"

# Define the number of parallel requests
NUM_REQUESTS=10

# Function to send a single request
send_request() {
    curl -s "$ENDPOINT_URL" >/dev/null
}

# Infinite loop to continuously send requests
while true; do
    # Loop to send multiple requests in parallel
    for ((i=1; i<=$NUM_REQUESTS; i++)); do
        send_request &
    done

    # Wait for all background processes to finish
    wait

    echo "All requests completed. Sleeping for 5 seconds before next round."

    # Sleep for 5 seconds before starting the next round of requests
    sleep 5
done