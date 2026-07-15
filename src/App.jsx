import SettingsForm from './Settingsform';

function App() {
  // Default values jo precise form ko supply karni hain
  const userDefaults = {
    displayName: 'Musfirah Shakeel',
    email: 'musfirah@example.com',
    bio: 'Software Engineering Student'
  };

  const handleSave = (formData) => {
    console.log('Saved Data:', formData);
    alert('Settings updated successfully!');
  };

  return (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
      <SettingsForm defaultValues={userDefaults} onSubmit={handleSave} />
    </div>
  );
}

export default App;