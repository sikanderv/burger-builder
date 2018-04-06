import React from 'react';

// Import enzyme to be able write test logic
// shallow renders the component but not deeply
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import NavigationItems from './NavigationItems';
import NavigationItem from './NavigationItem/NavigationItem';

// connect enzyme
configure({adapter: new Adapter()});


describe('<NavigationItems />', () => {
    let wrapper;
    // helper method to wrap multiple similar kind of test cases
    beforeEach(() => {
       wrapper = shallow(<NavigationItems />);
    });


    // 'it' allows to write one test
    it('should render 2 <NavigationItem/> elements if NOT authenticated', () => {
        // render a NavItems component and examine it with shallow
        // jsx should be passed to shallow
        // const wrapper = shallow(<NavigationItems />);
        // there should be at least 2 NavigationItem compoents rendered when user is not authenticated
        expect(wrapper.find(NavigationItem)).toHaveLength(2);
    });

    it('should render 3 <NavigationItem/> elements IF authenticated', () => {
        // render a NavItems component and examine it with shallow
        // jsx should be passed to shallow
        // const wrapper = shallow(<NavigationItems isAuthenticated />);
        wrapper.setProps({isAuthenticated: true});
        // there should be at least 3 NavigationItem compoents rendered when user IS authenticated
        expect(wrapper.find(NavigationItem)).toHaveLength(3);
    });

    it('should have a Logout link if authenticated', () => {
        // there should be a Logout link present if authenticated
        wrapper.setProps({isAuthenticated: true});        
        expect(wrapper.contains(<NavigationItem link="/logout">Logout</NavigationItem>)).toEqual(true);
    });

});