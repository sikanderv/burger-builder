import React, {Component} from 'react';

import Modal from '../../components/UI/Modal/Modal';
import Aux from '../Auxiliary/Auxiliary';


const withErrorHandler = (WrappedComponent, axios) => {

    // anonymous class - class factory
    return class extends Component {

        state = {
            error: null
        }

        // Commonly used lifecycle hook for interacting with data/web services
        // Initially compDidMount, changed to WillMount due to child compoments getting rendered (Section 10, Lecture 168)
        // apparently this will not cause side effects, just registers the interceptors
        componentWillMount() {
            // clear error, if any, from previous responses
            this.reqInterceptor = axios.interceptors.request.use(req => {
                this.setState({
                    error: null
                });
                return req;
            })

            // axios.interceptors.response.use((res, error) =>{
            //     this.setState({
            //         error: error
            //     });
            //     return res;
            // });

            // short syntax for the above
            this.resInterceptor = axios.interceptors.response.use(res => res, error => {
                this.setState({error: error});
            });
        }

        errorConfirmedHandler = () => {
            this.setState({error: null});
        }

        // Lecture 169, section 10
        componentWillUnmount() {
            // console.log('Inside [componentWillUnmount]', this.reqInterceptor, this.resInterceptor);
            axios.interceptors.request.eject(this.reqInterceptor);
            axios.interceptors.response.eject(this.resInterceptor);            
        }

        render() {
            return (
                <Aux>
                    <Modal 
                        show={this.state.error}
                        modalClosed={this.errorConfirmedHandler}>
                        {this.state.error ? this.state.error.message: null}
                    </Modal>
                   <WrappedComponent {...this.props} />
                </Aux>
            );
    
        };
    }

}

export default withErrorHandler;