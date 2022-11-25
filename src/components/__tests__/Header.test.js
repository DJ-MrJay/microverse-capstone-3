import { render, screen } from '@testing-library/react';
import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import Header from '../Header';
import store from '../redux/configureStore';

const MockHeader = () => (
  <Provider store={store}>
    <BrowserRouter>
      <Header />
    </BrowserRouter>
  </Provider>
);

describe('Test the Header component', () => {
  test('renders correctly', () => {
    const tree = renderer.create(<MockHeader />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should render the title', () => {
    render(<MockHeader />);
    const titleElement = screen.getByTestId('title');
    expect(titleElement).toBeInTheDocument();
    expect(titleElement).toHaveTextContent('POKEMON');
  });

  test('should render the search icon', () => {
    render(<MockHeader />);
    const inputElement = screen.getByTestId('searchIcon');
    expect(inputElement).toBeInTheDocument();
  });
});
