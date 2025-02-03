import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Form1 } from './_party/components/form-1';
import { ButtonLoading } from '@/stories/components/button-loading';
import { DialogWithFramer, DialogShadcn } from '@/stories/components/dialog';

export default function FormWithoutLibrariesPage() {
    return (
        <div className="w-full">
            <ResizablePanelGroup direction="horizontal">
                <ResizablePanel>
                    <ResizablePanelGroup direction="vertical">
                        <ResizablePanel className="bg-[#201f24] p-2">
                            <Form1 />
                        </ResizablePanel>
                        <ResizableHandle withHandle={true} />
                        <ResizablePanel>Two</ResizablePanel>
                    </ResizablePanelGroup>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel>
                    <ResizablePanelGroup direction="vertical">
                        <ResizablePanel>
                            <ButtonLoading />
                        </ResizablePanel>
                        <ResizableHandle withHandle={true} />
                        <ResizablePanel>
                            <div className="w-full h-full">
                                <DialogShadcn />
                                <DialogWithFramer />
                            </div>
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
}
