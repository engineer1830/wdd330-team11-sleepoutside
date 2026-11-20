document.getElementById('newsletter-form').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevents the page from refreshing

    // Extract data using the input 'name' attributes
    const formData = new FormData(event.target);
    const subscriber = {
        name: formData.get('name'),
        email: formData.get('email'),
        subscribedAt: new Date().toISOString()
    };

    try {
        const response = await fetch('/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(subscriber)
        });

        if (response.ok) {
            alert('Thank you for subscribing!');
            event.target.reset();
        }
    } catch (error) {
        console.error('Error:', error);
    }
});
