import { Meta, IconGallery, IconItem } from '@storybook/blocks';
import { LiaAlignCenterSolid, LiaAlignJustifySolid, LiaAlignLeftSolid, LiaAlignRightSolid } from 'react-icons/lia';

export function T() {
    return (
        <>
            <Meta title="Test/Base/Icons" />
            <IconGallery>
                <IconItem name="align-center">
                    <LiaAlignCenterSolid />
                </IconItem>
                <IconItem name="align-justify">
                    <LiaAlignJustifySolid />
                </IconItem>
                <IconItem name="align-left">
                    <LiaAlignLeftSolid />
                </IconItem>
                <IconItem name="align-right">
                    <LiaAlignRightSolid />
                </IconItem>
            </IconGallery>
        </>
    );
}
