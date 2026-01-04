# Artify - Redefining Digital Artistry 🎨

**Live Demo:** [https://artify-client.vercel.app/](https://artify-client.vercel.app/)

Artify is a modern, responsive digital art gallery platform where creativity meets community. Built with **React** and **Vite**, it empowers artists to showcase their work and collectors to discover unique masterpieces from around the globe.

---

## 🌟 Key Features

### 🔐 Authentication & Security

- **Secure Login & Registration**: User authentication powered by **Firebase**.
- **Social Login**: One-click sign-in with **Google**.
- **Password Strength Validation**: Robust validation requiring uppercase, lowercase, and minimum length.
- **Eye Toggle**: Show/hide password functionality for better UX.

### 🖼️ Artist & User Dashboard

- **Profile Management**: Update display name and upload profile pictures directly to **ImgBB**.
- **Add Artwork**: Seamlessly upload artwork with image hosting, details, and categorization.
- **My Artworks**: Manage your personal gallery (Edit/Delete artworks).
- **Favorites**: Save and organize artworks you love.

### 🎨 Gallery & Exploration

- **Dynamic Gallery**: Browse a vast collection of digital art, paintings, sketches, and more.
- **Advanced Search & Filtering**: Find art by title, artist, or specific categories (Painting, Digital, Scripture, etc.).
- **Artwork Details**: View high-quality images, artist info, price, dimensions, and more.
- **Responsive Slider**: Engaging homepage slider featuring curated highlights.

### 🛡️ Admin Dashboard (Role-Based Access)

- **Manage Users**: Admins can promote/demote users and manage user roles.
- **Content Moderation**: Review reported artworks and ensure community guidelines are followed.
- **Platform Analytics**: Visual charts (Recharts) showing user growth, artwork uploads, and more.

### 🌗 Modern UI/UX

- **Dark/Light Mode**: Fully thematic support for a personalized viewing experience.
- **Responsive Design**: Pixel-perfect layout optimized for mobile, tablet, and desktop.
- **Interactive Elements**: Lottie animations, sweet alerts (Swal2), and seamless transitions.
- **Global Loading Spinner**: Customized loading state for a polished experience.

---

## 🛠️ Technology Stack

- **Frontend**: React, Vite, Tailwind CSS, DaisyUI
- **State Management**: TanStack Query (React Query), Context API
- **Routing**: React Router DOM (with Private & Admin Routes)
- **Authentication**: Firebase Auth
- **Backend Communication**: Axios (with Interceptors)
- **Image Hosting**: ImgBB API
- **Data Visualization**: Recharts
- **Icons**: Lucide React, React Icons

---

## 🚀 Quick Start (Local Development)

1.  **Clone the repository**

    ```bash
    git clone https://github.com/alamin-islam0/artify-client.git
    cd artify-client
    ```

2.  **Install dependencies**

    ```bash
    npm install
    ```

3.  **Configure Environment Variables**
    Create a `.env.local` file in the root directory and add your Firebase and API keys:

    ```env
    VITE_API_URL=http://localhost:3000
    VITE_IMGBB_API_KEY=your_imgbb_key
    # Add your Firebase config keys here
    ```

4.  **Run the development server**

    ```bash
    npm run dev
    ```

5.  **Open in Browser**
    Visit [http://localhost:5173](http://localhost:5173) to view the app.

---

## 📦 Build for Production

To create an optimized production build:

```bash
npm run build
npm run preview
```

---

## 🤝 Contributing

We welcome contributions! Please feel free to shout out, suggest improvements, or submit a pull request.

---

_Crafted with ❤️ by the Artify Team._
