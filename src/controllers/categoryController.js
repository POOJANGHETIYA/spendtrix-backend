const supabase = require('../config/supabase');

exports.getCategories = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', req.user.userId);

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.createCategory = async (req, res) => {
  const { name } = req.body;
  console.log('user => ',req.user);
  

  try {
    const { data, error } = await supabase
      .from('categories')
      .insert({ name, user_id: req.user.userId })
      .select();

    if (error) throw error;

    res.status(201).json(data[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Todo :  Add updateCategory and deleteCategory methods here
