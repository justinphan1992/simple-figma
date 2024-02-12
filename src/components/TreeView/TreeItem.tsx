import { forwardRef } from 'react';
import Typography from '@mui/material/Typography';
import { TreeItemContentProps as MuiTreeItemContentProps, TreeItem as MuiTreeItem, useTreeItem, TreeItemProps as MuiTreeItemProps } from '@mui/x-tree-view/TreeItem'
import clsx from 'clsx';
import { Box } from '@mui/material';

export type TreeItemProps = Omit<MuiTreeItemProps, 'ContentProps'> & {
  ContentProps?: React.HTMLAttributes<HTMLElement> & {
    selected?: boolean;
    onSelectNode?: (nodeId: string, isSelected: boolean) => void
  }
}

export type TreeItemContentProps = MuiTreeItemContentProps & {
  selected?: boolean;
  onSelectNode?: (nodeId: string, _selected: boolean) => void
}

const CustomContent = forwardRef(function CustomContent(
  props: TreeItemContentProps,
  ref,
) {
  const {
    classes,
    className,
    label,
    nodeId,
    icon: iconProp,
    expansionIcon,
    displayIcon,
    onSelectNode,
    selected,
  } = props;

  const {
    disabled,
    expanded,
    focused,
    handleExpansion,
  } = useTreeItem(nodeId);

  const icon = iconProp || expansionIcon || displayIcon;

  const handleExpansionClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    handleExpansion(event);
  };

  const handleSelectNode = () => {
    onSelectNode && onSelectNode(nodeId, !selected)
  }


  return (
    <div
      className={clsx(className, classes.root, {
        [classes.expanded]: expanded,
        [classes.selected]: selected,
        [classes.focused]: focused,
        [classes.disabled]: disabled,
      })}
      ref={ref as React.Ref<HTMLDivElement>}
    >
      <div onClick={handleExpansionClick} className={classes.iconContainer}>
        {icon}
      </div>
      <Box onClick={handleSelectNode} display={'flex'} alignItems={'center'} justifyContent={'space-between'} width={'100%'}>
        <Typography className={classes.label}>
          {label}
        </Typography>
        {
          nodeId !== 'root' && (
            <Typography textAlign={'right'} className={classes.label}>
              {selected ? 'Unselect' : 'Select'}
            </Typography>
          )
        }
      </Box>

    </div>
  );
});

const TreeItem = forwardRef(function TreeItem(
  props: TreeItemProps,
  ref: React.Ref<HTMLLIElement>,
) {
  return <MuiTreeItem ContentComponent={CustomContent} {...props} ref={ref} />;
});

export default TreeItem