// @flow
import React, { forwardRef, Component, type Node } from 'react';
import { LocaleProviderConsumer } from './LocaleProvider';
import { NamespaceConsumer } from './Namespace';

type Props = {
  localeProvider: Node,
  namespace: Node,
  children: Function,
  ignoreNamespace?: boolean,
};

class ProvideTranslate extends Component<Props> {
  static defaultProps = {
    ignoreNamespace: false,
  };

  getPath(path: string): string {
    const { namespace, ignoreNamespace } = this.props;
    if (!namespace || ignoreNamespace) {
      return path;
    }

    const parentPath = namespace.getPath();
    if (!parentPath) {
      return path;
    }

    return `${parentPath}.${path}`;
  }

  translate = (path: string, ...args): string => {
    const { localeProvider } = this.props;

    return localeProvider.get(this.getPath(path), ...args);
  }

  render() {
    const { children } = this.props;

    return children(this.translate);
  }
}

export default forwardRef((props, ref) => (
  <LocaleProviderConsumer>
    {({ localeProvider }) => (
      <NamespaceConsumer>
        {({ namespace }) => (
          <ProvideTranslate
            {...props}
            localeProvider={localeProvider}
            namespace={namespace}
            ref={ref}
          />
        )}
      </NamespaceConsumer>
    )}
  </LocaleProviderConsumer>
));
