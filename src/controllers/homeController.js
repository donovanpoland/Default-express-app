import { getWelcomeMessage } from '../models/exampleModel.js';
import { pageMeta } from '../config/pageMeta.js';


// Define Home controller functions
const index = async (req, res) => {
  const example = getWelcomeMessage();


  // Render page data via objects and variables listed below
  res.render('home', {
    ...pageMeta.home,
    message: example,
  });
}

// Export any controller functions
export { index };
