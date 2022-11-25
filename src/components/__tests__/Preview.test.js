import { render, screen } from '@testing-library/react';
import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import Preview from '../Preview';
import store from '../redux/configureStore';

const MockPreview = () => (
  <Provider store={store}>
    <BrowserRouter>
      <Preview pokemon={{ id: '1', name: 'bulbasaur' }} />
    </BrowserRouter>
  </Provider>
);

describe('Test the Preview component', () => {
  test('renders correctly', () => {
    const tree = renderer.create(<MockPreview />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('renders link', () => {
    render(<MockPreview />);
    const linkElement = screen.getByRole('link', {
      name: /01 bulbasaur/i,
    });
    expect(linkElement).toBeInTheDocument();
  });

  test('renders heading', () => {
    render(<MockPreview />);
    const headingElement = screen.getByRole('heading', {
      name: /bulbasaur/i,
    });
    expect(headingElement).toBeInTheDocument();
  });
});
