import React, { useState, useEffect } from 'react';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false); 
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [recipes, setRecipes] = useState([]);
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [cookingTime, setCookingTime] = useState('');
  const [difficulty, setDifficulty] = useState('קל');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('הכל');

  const fetchRecipes = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/recipes');
      if (response.ok) {
        const data = await response.json();
        setRecipes(data);
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };

  const fetchExpressRecipes = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/recipes/express');
      if (response.ok) {
        const data = await response.json();
        setRecipes(data); 
      }
    } catch (error) {
      console.error("Error fetching express recipes:", error);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === '1234') {
      setIsAdmin(true);
      setShowLoginModal(false); 
      setUsername('');
      setPassword('');
    } else {
      alert('שם משתמש או סיסמה שגויים!');
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !ingredients || !instructions || !cookingTime) {
      return alert("נא למלא את כל השדות כדי להוסיף מתכון!");
    }

    const newRecipe = { 
      title, 
      ingredients, 
      instructions, 
      cookingTime: parseInt(cookingTime), 
      difficulty 
    };

    try {
      const response = await fetch('http://localhost:8080/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRecipe)
      });
      
      if (response.ok) {
        setTitle('');
        setIngredients('');
        setInstructions('');
        setCookingTime('');
        setDifficulty('קל');
        fetchRecipes(); 
      }
    } catch (error) {
      alert("שגיאה בחיבור לשרת");
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm("האם למחוק מתכון זה?")) {
      try {
        await fetch(`http://localhost:8080/api/recipes/${id}`, { method: 'DELETE' });
        fetchRecipes();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          recipe.ingredients.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDifficulty = selectedDifficulty === 'הכל' || recipe.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesDifficulty;
  });

  return (
    <div style={{ backgroundColor: '#fcf8f2', minHeight: '100vh', fontFamily: '"Segoe UI", Roboto, sans-serif', direction: 'rtl', padding: '40px 20px' }}>
      
      {/* באנר עליון דינמי לפי תפקיד המשתמש */}
      <div style={{ background: 'linear-gradient(135deg, #e67e22, #d35400)', color: 'white', padding: '30px 40px', borderRadius: '15px', boxShadow: '0 10px 20px rgba(211,84,0,0.2)', marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '32px', fontWeight: '800' }}>ChefBook • ספר המתכונים הדיגיטלי</h1>
          <p style={{ margin: '5px 0 0 0', opacity: 0.9, fontSize: '16px' }}>
            {isAdmin ? "מחובר כעת כ: מנהל מערכת (אזור עריכה פעיל)" : "מצב צפייה וחיפוש חופשי"}
          </p>
        </div>
        
        {isAdmin ? (
          <button onClick={handleLogout} style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid white', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>
            יציאה ממצב מנהל
          </button>
        ) : (
          <button onClick={() => setShowLoginModal(true)} style={{ backgroundColor: 'white', color: '#d35400', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
            🔐 כניסת מנהל
          </button>
        )}
      </div>

      {/* מודל / חלונית קופצת להתחברות מנהל */}
      {showLoginModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', width: '90%', maxWidth: '360px', boxShadow: '0 5px 15px rgba(0,0,0,0.2)' }}>
            <h3 style={{ margin: '0 0 20px 0', color: '#2c3e50', textAlign: 'center' }}>התחברות מנהל מערכת</h3>
            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>שם משתמש:</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} style={inputStyle} required />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>סיסמה:</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} required />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" style={{ flex: 1, backgroundColor: '#2ecc71', color: 'white', border: 'none', padding: '10px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>התחבר</button>
                <button type="button" onClick={() => setShowLoginModal(false)} style={{ flex: 1, backgroundColor: '#95a5a6', color: 'white', border: 'none', padding: '10px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>ביטול</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* מבנה העמוד הראשי */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: isAdmin ? '1fr 2fr' : '1fr', gap: '30px' }}>
        
        {/* עמודת ימין: טופס הוספה - יוצג אך ורק אם מחובר מנהל (isAdmin) */}
        {isAdmin && (
          <div>
            <form onSubmit={handleSubmit} style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', borderTop: '5px solid #e67e22', position: 'sticky', top: '20px' }}>
              <h3 style={{ margin: '0 0 20px 0', color: '#2c3e50', fontSize: '20px' }}>הוספת מתכון חדש</h3>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '6px', color: '#34495e' }}>שם המתכון:</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} style={inputStyle} placeholder="עוגת גבינה..." />
              </div>

              <div style={{ marginBottom: '15px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', color: '#34495e' }}>זמן הכנה (דקות):</label>
                  <input type="number" value={cookingTime} onChange={(e) => setCookingTime(e.target.value)} style={inputStyle} placeholder="דקות..." />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', color: '#34495e' }}>רמת קושי:</label>
                  <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} style={inputStyle}>
                    <option value="קל">קל</option>
                    <option value="בינוני">בינוני</option>
                    <option value="מאתגר">מאתגר</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '6px', color: '#34495e' }}>מצרכים:</label>
                <textarea value={ingredients} onChange={(e) => setIngredients(e.target.value)} style={{ ...inputStyle, height: '70px', resize: 'none' }} />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '6px', color: '#34495e' }}>הוראות הכנה:</label>
                <textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} style={{ ...inputStyle, height: '90px', resize: 'none' }} />
              </div>

              <button type="submit" style={{ background: '#2ecc71', color: 'white', border: 'none', padding: '12px', borderRadius: '6px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', width: '100%' }}>
                ✓ שמור מתכון
              </button>
            </form>
          </div>
        )}

        {/* עמודת רשימה וחיפוש - תמיד מוצגת, משנה רוחב בהתאם לתפקיד */}
        <div>
          
          {/* פאנל המסננים - נגיש לכולם */}
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', marginBottom: '25px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <h4 style={{ margin: 0, color: '#2c3e50' }}>🔍 מסננים חכמים וחיפוש:</h4>
            
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '15px' }}>
              <input 
                type="text" 
                placeholder="חפש לפי שם או רכיב מסוים..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={inputStyle}
              />
              
              <select 
                value={selectedDifficulty} 
                onChange={(e) => setSelectedDifficulty(e.target.value)} 
                style={inputStyle}
              >
                <option value="הכל">כל רמות הקושי</option>
                <option value="קל">קל בלבד</option>
                <option value="בינוני">בינוני בלבד</option>
                <option value="מאתגר">מאתגר בלבד</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={fetchExpressRecipes} style={{ background: '#e67e22', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '20px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>
                ⏱ הצג מתכונים מהירים בלבד (עד 30 דק')
              </button>
              <button onClick={fetchRecipes} style={{ background: '#7f8c8d', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '20px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>
                🔄 אפס סינון זמנים (הצג הכל)
              </button>
            </div>
          </div>

          <h3 style={{ color: '#2c3e50', marginBottom: '15px' }}>המתכונים שנמצאו ({filteredRecipes.length})</h3>
          
          {filteredRecipes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', backgroundColor: 'white', borderRadius: '12px', color: '#7f8c8d' }}>
              לא נמצאו מתכונים התואמים לפילטרים.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: isAdmin ? '1fr 1fr' : '1fr 1fr 1fr', gap: '20px' }}>
              {filteredRecipes.map((recipe) => (
                <div key={recipe.id} style={{ backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h4 style={{ margin: '0 0 10px 0', color: '#e67e22', fontSize: '18px', fontWeight: 'bold' }}>{recipe.title}</h4>
                      <span style={{ backgroundColor: recipe.difficulty === 'קל' ? '#e8f8f5' : recipe.difficulty === 'בינוני' ? '#fef9e7' : '#fdedec', color: recipe.difficulty === 'קל' ? '#1abc9c' : recipe.difficulty === 'בינוני' ? '#f39c12' : '#e74c3c', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
                        {recipe.difficulty}
                      </span>
                    </div>
                    
                    <div style={{ fontSize: '13px', color: '#7f8c8d', marginBottom: '12px' }}>
                      ⏱ זמן הכנה: <strong>{recipe.cookingTime} דקות</strong>
                    </div>

                    <p style={{ margin: '0 0 8px 0', fontSize: '14px' }}>
                      <strong>רכיבים:</strong> <span style={{ color: '#555' }}>{recipe.ingredients}</span>
                    </p>
                    <p style={{ margin: 0, fontSize: '14px' }}>
                      <strong>אופן ההכנה:</strong> <span style={{ color: '#555', display: 'block', marginTop: '4px' }}>{recipe.instructions}</span>
                    </p>
                  </div>
                  
                  {/* כפתור מחיקה - יוצג בתחתית הכרטיס אך ורק למנהל (isAdmin) */}
                  {isAdmin && (
                    <div style={{ padding: '12px 20px', backgroundColor: '#fdfefe', borderTop: '1px solid #f5f5f5', textAlign: 'left' }}>
                      <button onClick={() => handleDelete(recipe.id)} style={{ background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>
                        🗑 מחק מתכון
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #dcdde1', fontFamily: 'inherit', fontSize: '14px', outline: 'none', boxSizing: 'border-box', backgroundColor: '#fdfdfd'
};

export default App;