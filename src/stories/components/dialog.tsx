'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
    Dialog as DialogOwn,
    DialogContent as DialogContentOwn,
    DialogPortal as DialogPortalOwn,
    DialogOverlay as DialogOverlayOwn,
    DialogDescription as DialogDescriptionOwn,
    // DialogFooter as DialogFooterOwn,
    // DialogHeader as DialogHeaderOwn,
    DialogTitle as DialogTitleOwn,
    DialogTrigger as DialogTriggerOwn,
    DialogClose as DialogCloseOwn,
} from '@/components/ui/custom/dialog';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function DialogShadcn() {
    const [open, setOpen] = React.useState(false);

    console.log('ShadcnModal RENDER', open, new Date().getTime());
    return (
        <Dialog
            open={open}
            onOpenChange={setOpen}
        >
            <DialogTrigger asChild>
                <Button variant="outline">Shadcn Modal</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit profile</DialogTitle>
                    <DialogDescription>Make changes to your profile here. Click save when you&lsquo;re done.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label
                            htmlFor="name"
                            className="text-right"
                        >
                            Name
                        </Label>
                        <Input
                            id="name"
                            defaultValue="Pedro Duarte"
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label
                            htmlFor="username"
                            className="text-right"
                        >
                            Username
                        </Label>
                        <Input
                            id="username"
                            defaultValue="@peduarte"
                            className="col-span-3"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit">Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export function DialogWithFramer() {
    const [open, setOpen] = React.useState(false);
    // const handleOpenChange = React.useCallback((isOpen: boolean) => {
    //     setOpen(isOpen);
    // }, []);
    console.log('OwnModal RENDER', open, new Date().getTime());
    return (
        <DialogOwn
            open={open}
            onOpenChange={setOpen}
        >
            <DialogTriggerOwn
                variant="outline"
                asChild
            >
                <Button variant="destructive">Own Modal</Button>
            </DialogTriggerOwn>
            <DialogPortalOwn>
                <DialogOverlayOwn />
                <DialogContentOwn
                    aria-description="conten-paga"
                    className="sm:max-w-[425px]"
                >
                    <DialogCloseOwn />
                    <DialogHeader>
                        <DialogTitleOwn>Edit profile</DialogTitleOwn>
                        <DialogDescriptionOwn>Make changes to your profile here. Click save when you&lsquo;re done.</DialogDescriptionOwn>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                                htmlFor="name"
                                className="text-right"
                            >
                                Name
                            </Label>
                            <Input
                                id="name"
                                defaultValue="Pedro Duarte"
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                                htmlFor="username"
                                className="text-right"
                            >
                                Username
                            </Label>
                            <Input
                                id="username"
                                defaultValue="@peduarte"
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    {/* <DialogFooterOwn>
                    <Button type="submit">Save changes</Button>
                </DialogFooterOwn> */}
                </DialogContentOwn>
            </DialogPortalOwn>
        </DialogOwn>
    );
}
