#!/bin/bash

# Navigate to the frontend directory
cd frontend || exit 1

# Create directory structure
mkdir -p src/{components,pages,styles/{components,pages}}


# Create Pages
cat <<EOL > src/pages/HomePage.tsx
const HomePage = () => {
    return <h1>Welcome to CalTrack! Track your progress here.</h1>;
};

export default HomePage;
EOL

cat <<EOL > src/pages/DashboardPage.tsx
const DashboardPage = () => {
    return <h1>User Dashboard: Track your calories and workouts</h1>;
};

export default DashboardPage;
EOL

cat <<EOL > src/pages/WorkoutPage.tsx
const WorkoutPage = () => {
    return <h1>Workout Tracking: Log and manage your workouts</h1>;
};

export default WorkoutPage;
EOL

cat <<EOL > src/pages/NutritionPage.tsx
const NutritionPage = () => {
    return <h1>Nutrition Tracking: Log your daily intake</h1>;
};

export default NutritionPage;
EOL

cat <<EOL > src/pages/CalendarPage.tsx
const CalendarPage = () => {
    return <h1>Calendar: Visualize your progress</h1>;
};

export default CalendarPage;
EOL

cat <<EOL > src/pages/MilestonesPage.tsx
const MilestonesPage = () => {
    return <h1>Milestones: See your achievements and rewards</h1>;
};

export default MilestonesPage;
EOL

cat <<EOL > src/pages/ProfilePage.tsx
const ProfilePage = () => {
    return <h1>Profile: Update your personal information and goals</h1>;
};

export default ProfilePage;
EOL

# Create Components
cat <<EOL > src/components/Button.tsx
import './styles/components/button.scss';

const Button = ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => {
    return <button className="btn" onClick={onClick}>{children}</button>;
};

export default Button;
EOL

cat <<EOL > src/components/Input.tsx
import './styles/components/input.scss';

const Input = ({ placeholder, type = 'text', value, onChange }: { placeholder: string; type?: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => {
    return <input className="input" placeholder={placeholder} type={type} value={value} onChange={onChange} />;
};

export default Input;
EOL

cat <<EOL > src/components/Header.tsx
import { Link } from 'react-router-dom';
import './styles/components/header.scss';

const Header = () => {
    return (
        <header className="header">
            <h1>CalTrack</h1>
            <nav>
                <Link to="/">Home</Link>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/workouts">Workouts</Link>
                <Link to="/nutrition">Nutrition</Link>
                <Link to="/calendar">Calendar</Link>
                <Link to="/milestones">Milestones</Link>
                <Link to="/profile">Profile</Link>
            </nav>
        </header>
    );
};

export default Header;
EOL

# Create SASS files
cat <<EOL > src/styles/variables.scss
\$primary-color: #3498db;
\$secondary-color: #2ecc71;
\$font-family: 'Arial, sans-serif';
EOL

cat <<EOL > src/styles/base.scss
@import './variables.scss';

body {
    margin: 0;
    font-family: \$font-family;
    background-color: #f4f4f4;
    color: #333;
}

h1 {
    color: \$primary-color;
}

a {
    text-decoration: none;
    color: \$primary-color;

    &:hover {
        color: darken(\$primary-color, 10%);
    }
}
EOL

cat <<EOL > src/styles/components/button.scss
.btn {
    background-color: \$primary-color;
    color: #fff;
    border: none;
    padding: 0.5rem 1rem;
    cursor: pointer;
    border-radius: 5px;
    transition: background-color 0.3s;

    &:hover {
        background-color: darken(\$primary-color, 10%);
    }
}
EOL

cat <<EOL > src/styles/components/input.scss
.input {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 5px;
    width: 100%;
    margin-bottom: 1rem;
}
EOL

cat <<EOL > src/styles/components/header.scss
.header {
    background-color: \$primary-color;
    padding: 1rem;
    color: #fff;

    nav {
        display: flex;
        gap: 1rem;

        a {
            color: #fff;
            font-weight: bold;

            &:hover {
                text-decoration: underline;
            }
        }
    }
}
EOL

echo "All files, pages, and components have been created successfully!"
