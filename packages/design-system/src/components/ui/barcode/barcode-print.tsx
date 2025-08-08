import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { useReactToPrint } from 'react-to-print';
import JsBarcode from 'jsbarcode';
import { Modal, Button, Group, NumberInput, SegmentedControl, Text, Select } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

interface BarcodeProps {
	barcode: string;
	productName: string;
	price: number;
	useWindowPrint?: boolean;
	children?: React.ReactNode;
	units: {
		name: string;
		value: string | number;
		id: string;
	}[];
}

function MinimalBarcode({
	barcode,
	productName,
	price,
	useWindowPrint = false,
	children,
	units = [],
}: BarcodeProps) {
	const componentRef = useRef<HTMLDivElement>(null);
	const svgRef = useRef<SVGSVGElement>(null);
	const [opened, { open, close }] = useDisclosure(false);
	const [columns, setColumns] = useState<number>(1);
	const [rows, setRows] = useState<number>(10);
	const [unit, setUnit] = useState<BarcodeProps['units'][number] | null>(units[0] || null);
	// Tạo ref list để lưu trữ các SVG elements
	const barcodeRefs = useRef<SVGSVGElement[]>([]);

	// Tạo barcode riêng biệt cho mỗi item
	const renderBarcodeItem = useCallback(
		(index: number) => {
			// Hàm để lưu ref vào mảng
			const setBarcodeRef = (element: SVGSVGElement | null) => {
				if (element) {
					barcodeRefs.current[index] = element;
				}
			};

			// Khi in 1 cột, barcode sẽ rộng bằng khổ in
			const barcodeWidth = columns === 1 ? '100%' : '80%';

			return (
				<div
					key={index}
					style={{
						padding: '3px',
						boxSizing: 'border-box',
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
					}}>
					<svg ref={setBarcodeRef} style={{ width: barcodeWidth, height: 'auto' }} />
					{/* <div style={{ textAlign: 'center', marginTop: '3px', fontSize: '10px' }}>{productName}</div> */}
					<div style={{ textAlign: 'center', fontSize: '18px', fontWeight: 'bold' }}>
						Giá: {(unit ? unit.value : price).toLocaleString()}
						{unit ? `/${unit.name}` : ''}
					</div>
				</div>
			);
		},
		[productName, price, columns, unit],
	);

	// Tạo nội dung in với layout tùy chỉnh sử dụng Grid
	const printContent = useMemo(() => {
		// Reset refs array khi tạo mới nội dung
		barcodeRefs.current = [];

		const items = Array.from({ length: rows * columns }).map((_, index) =>
			renderBarcodeItem(index),
		);

		// Điều chỉnh padding và gap dựa trên số cột
		const gapSize = columns === 1 ? '10px' : columns === 2 ? '7px' : '5px';
		const paddingSize = columns === 1 ? '10px' : columns === 2 ? '7px' : '5px';

		return (
			<div
				ref={componentRef}
				style={{
					display: 'grid',
					gridTemplateColumns: `repeat(${columns}, 1fr)`,
					gridAutoRows: 'auto',
					width: '100%',
					// maxWidth: '21cm',
					margin: '0 auto',
					padding: paddingSize,
					gap: gapSize,
				}}>
				{items}
			</div>
		);
	}, [rows, columns, renderBarcodeItem]);

	// Tạo barcode cho item đầu tiên (dùng để hiển thị)
	useEffect(() => {
		if (svgRef.current && barcode) {
			JsBarcode(svgRef.current, barcode, {
				format: 'CODE128',
				displayValue: true,
				fontSize: 12,
				height: 40,
			});
		}
	}, [barcode]);

	// Tạo barcode cho các item in khi modal mở
	useEffect(() => {
		if (opened) {
			// Tạo barcode cho từng item
			setTimeout(() => {
				barcodeRefs.current.forEach(svgElement => {
					if (svgElement && barcode) {
						JsBarcode(svgElement, barcode, {
							format: 'CODE128',
							displayValue: true,
							fontSize: 12,
							height: 40,
						});
					}
				});
			}, 0);
		}
	}, [opened, rows, columns, barcode]);

	const handlePrint = useReactToPrint({
		contentRef: componentRef,
		pageStyle: `
      @media print {
        @page {
          size: ${columns === 1 ? 'auto' : 'A4'};
          margin: 5mm;
        }
        body {
          margin: 0;
          padding: 0;
        }
      }
    `,
	});

	const handleWindowPrint = useCallback(() => {
		const printWindow = window.open('', '_blank');
		if (printWindow) {
			// Điều chỉnh padding và gap dựa trên số cột
			const gapSize = columns === 1 ? '10px' : columns === 2 ? '7px' : '5px';
			const paddingSize = columns === 1 ? '10px' : columns === 2 ? '7px' : '5px';
			// Khi in 1 cột, barcode sẽ rộng bằng khổ in
			const barcodeWidth = columns === 1 ? '100%' : '80%';
			// Khi in 1 cột, sử dụng khổ giấy phù hợp
			const pageSize = columns === 1 ? 'auto' : 'A4';

			// Tạo layout in dựa trên số cột và hàng
			let itemsHtml = '';
			for (let i = 0; i < rows * columns; i++) {
				itemsHtml += `
          <div style="padding: 3px; box-sizing: border-box; display: flex; flex-direction: column; align-items: center;">
            <svg id="print-barcode-${i}" style="width: ${barcodeWidth}; height: auto;"></svg>
            <div style="text-align: center; margin-top: 3px; font-size: 10px;">${productName}</div>
            <div style="text-align: center; font-size: 10px;">${price.toLocaleString()} VND</div>
          </div>
        `;
			}

			printWindow.document.write(`
        <html>
          <head>
            <title>Barcode Print</title>
            <style>
              @media print {
                @page {
                  size: ${pageSize};
                  margin: 5mm;
                }
                body {
                  margin: 0;
                  padding: 0;
                }
                .print-container {
                  display: grid;
                  grid-template-columns: repeat(${columns}, 1fr);
                  grid-auto-rows: auto;
                  width: 100%;
                  gap: ${gapSize};
                  padding: ${paddingSize};
                }
              }
            </style>
          </head>
          <body>
            <div class="print-container">
              ${itemsHtml}
            </div>
            <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"></script>
            <script>
              window.onload = function () {
                // Tạo barcode cho từng item
                for (let i = 0; i < ${rows * columns}; i++) {
                  JsBarcode("#print-barcode-" + i, "${barcode}", {
                    format: "CODE128",
                    displayValue: true,
                    fontSize: 12,
                    height: 40
                  });
                }
                setTimeout(function() {
                  window.print();
                }, 500);
              };
            </script>
          </body>
        </html>
      `);
			printWindow.document.close();
		}
	}, [rows, columns, productName, price, barcode]);

	const onPrintClick = useCallback(() => {
		open();
	}, [open]);

	const handlePrintWithOptions = useCallback(() => {
		close();
		if (useWindowPrint) {
			handleWindowPrint();
		} else {
			handlePrint?.();
		}
	}, [close, useWindowPrint, handleWindowPrint, handlePrint]);

	return (
		<>
			{/* Component ẩn để tạo barcode SVG cho hiển thị */}
			<div className='hidden'>
				<svg ref={svgRef} />
			</div>

			{/* Nội dung in (ẩn đi, chỉ hiện khi modal mở) */}
			<div className='hidden'>{opened && printContent}</div>

			<Modal opened={opened} onClose={close} title='Tùy chọn in barcode' centered size='lg'>
				<div className='flex flex-col gap-4'>
					<div>
						<Text size='sm' fw={500} mb={5}>
							Số cột
						</Text>
						<SegmentedControl
							value={columns.toString()}
							onChange={value => setColumns(parseInt(value))}
							data={[
								{ label: '1 cột', value: '1' },
								{ label: '2 cột', value: '2' },
								{ label: '3 cột', value: '3' },
							]}
							fullWidth
						/>
					</div>

					<NumberInput
						label='Số lượng hàng'
						value={rows}
						onChange={value => setRows(value as number)}
						min={1}
						max={100}
					/>

					<Select
						label='Đơn vị'
						value={unit?.id || ''}
						onChange={value => setUnit(units.find(unit => unit.id === value) || null)}
						data={units?.map((unit, index) => ({ label: unit.name, value: unit.id })) || []}
					/>

					<Group justify='flex-end' mt='md'>
						<Button variant='default' onClick={close}>
							Hủy
						</Button>
						<Button onClick={handlePrintWithOptions}>In</Button>
					</Group>
				</div>
			</Modal>

			<div onClick={onPrintClick} style={{ cursor: 'pointer' }}>
				{children}
			</div>
		</>
	);
}

export default MinimalBarcode;
