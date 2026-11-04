import type { Block, BlockProps } from '../core/block';
import { isEqual } from '../utils/is-equal';
import { store, type AppState } from './store';

export function connect<Props extends BlockProps>(mapStateToProps: (state: AppState) => Partial<Props>) {
  return function (Component: new () => Block<Props>) {
    return class extends Component {
      private stateProps = mapStateToProps(store.getState());

      private readonly handleStoreUpdate = (): void => {
        const nextStateProps = mapStateToProps(store.getState());

        if (!isEqual(this.stateProps, nextStateProps)) {
          this.stateProps = nextStateProps;
          this.setProps(nextStateProps);
        }
      };

      constructor() {
        super();
        this.setProps(this.stateProps);
      }

      protected componentDidMount(): void {
        super.componentDidMount();
        store.on('updated', this.handleStoreUpdate);
      }

      protected componentWillUnmount(): void {
        store.off('updated', this.handleStoreUpdate);
        super.componentWillUnmount();
      }
    };
  };
}
