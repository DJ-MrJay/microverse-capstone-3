import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import MoreDetails from '../MoreDetails';
import store from '../redux/configureStore';

const MockMoreDetails = () => (
  <Provider store={store}>
    <BrowserRouter>
      <MoreDetails />
    </BrowserRouter>
  </Provider>
);

describe('Test the MoreDetails component', () => {
  test('renders correctly', () => {
    const tree = renderer.create(<MockMoreDetails />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
