# Klassik Asaeda

A modern, elegant website for classical music concerts featuring Nobuhiko Asaeda and fellow musicians, built with HTML, CSS, and vanilla JavaScript.

## Features

- Responsive design with a modern classical aesthetic
- Concert information and ticket sales
- Artist biographies
- Recording highlights
- Shopping cart functionality with localStorage persistence
- Netlify Forms integration for checkout

## Getting Started

### Prerequisites

- Git
- A code editor (VS Code, Sublime Text, etc.)
- Basic knowledge of HTML, CSS, and JavaScript

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/klassik-asaeda.git
   cd klassik-asaeda
   ```

2. Open the project in your code editor.

3. For local development, you can use a simple server like Live Server extension for VS Code or Python's SimpleHTTPServer:
   ```bash
   # If you have Python 3 installed
   python -m http.server
   ```

4. Visit `http://localhost:8000` in your browser.

## Deployment with Netlify

This site is designed to be deployed on Netlify with minimal configuration:

1. Push your repository to GitHub.

2. Log in to Netlify and click "New site from Git".

3. Select your GitHub repository.

4. Configure the build settings:
   - Build command: Leave empty (or `echo 'No build command'`)
   - Publish directory: `/`

5. Click "Deploy site".

6. Configure your forms in the Netlify admin panel.

## Folder Structure

```
klassik-asaeda/
├── README.md                      # Project documentation
├── .gitignore                     # Git ignore file
├── index.html                     # Homepage
├── konzerte.html                  # Concerts page
├── kuenstler.html                 # Artists page
├── aufnahmen.html                 # Recordings page
├── impressum.html                 # Imprint/legal page
├── datenschutz.html               # Privacy policy
├── assets/                        # Static assets
│   ├── css/
│   │   ├── main.css               # Main stylesheet
│   │   ├── normalize.css          # CSS reset
│   ├── js/
│   │   ├── main.js                # Main JavaScript file
│   │   ├── checkout.js            # Netlify Forms checkout functionality
│   ├── images/
│   │   ├── logo.png               # Logo
│   │   ├── artists/               # Artist photos
│   │   ├── venues/                # Venue photos
│   │   ├── hero-images/           # Hero banner images
│   ├── fonts/                     # Custom fonts (if needed)
├── netlify.toml                   # Netlify configuration
```

## Netlify Forms Integration

This project uses Netlify Forms to handle the checkout process. When a user submits an order, the form data is sent to Netlify and can be accessed in the Netlify dashboard under the "Forms" tab.

To set up email notifications for new orders:

1. Go to your site settings in Netlify.
2. Navigate to Forms > Form notifications.
3. Set up email notifications for the "checkout" form.

## Customization

### Colors

The site's color scheme can be easily modified by changing the CSS variables in `assets/css/main.css`:

```css
:root {
    --color-primary: #231216; /* Deep brown */
    --color-secondary: #C0A872; /* Gold */
    /* other variables... */
}
```

### Content

Update the content in the HTML files:

- `index.html`: Homepage with hero banner and feature boxes
- `konzerte.html`: Upcoming concerts listing
- `kuenstler.html`: Artist biographies
- `aufnahmen.html`: Music recordings

### Images

Replace the placeholder images in the `assets/images/` directory with your own:

- Logo: `assets/images/logo.png`
- Hero images: `assets/images/hero-images/`
- Artist photos: `assets/images/artists/`
- Venue photos: `assets/images/venues/`

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Fonts: Cormorant Garamond & Raleway from Google Fonts
- Normalize.css for CSS reset
