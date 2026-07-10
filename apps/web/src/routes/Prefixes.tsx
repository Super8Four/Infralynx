import type { PrefixSummary } from '@infralynx/shared';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const prefixFormSchema = z.object({
  cidr: z.string().trim().min(3, 'Enter an IPv4 or IPv6 prefix.'),
  description: z.string().trim().max(1000),
});
type PrefixForm = z.infer<typeof prefixFormSchema>;

const samplePrefixes: PrefixSummary[] = [
  {
    id: 'f635b843-f3df-447a-b21b-7fde7373019e',
    cidr: '10.0.0.0/8',
    family: 'ipv4',
    status: 'reserved',
    description: 'Private infrastructure address space',
  },
];

const column = createColumnHelper<PrefixSummary>();
const columns = [
  column.accessor('cidr', { header: 'Prefix' }),
  column.accessor('family', { header: 'Family' }),
  column.accessor('status', { header: 'Status' }),
  column.accessor('description', { header: 'Description' }),
];

export function Prefixes() {
  const table = useReactTable({
    data: samplePrefixes,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  const form = useForm<PrefixForm>({
    resolver: zodResolver(prefixFormSchema),
    defaultValues: { cidr: '', description: '' },
  });

  return (
    <div className="row g-3">
      <div className="col-12 col-xl-8">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Prefixes</h3>
          </div>
          <div className="card-body table-responsive p-0">
            <table className="table table-hover mb-0">
              <thead>
                {table.getHeaderGroups().map((group) => (
                  <tr key={group.id}>
                    {group.headers.map((header) => (
                      <th key={header.id}>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="col-12 col-xl-4">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Validate a prefix</h3>
          </div>
          <form
            className="card-body"
            onSubmit={(event) => void form.handleSubmit(() => undefined)(event)}
          >
            <label className="form-label" htmlFor="cidr">
              Prefix
            </label>
            <input
              id="cidr"
              className="form-control"
              placeholder="192.0.2.0/24"
              {...form.register('cidr')}
            />
            {form.formState.errors.cidr && (
              <div className="text-danger small mt-1">
                {form.formState.errors.cidr.message}
              </div>
            )}
            <label className="form-label mt-3" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              className="form-control"
              rows={3}
              {...form.register('description')}
            />
            <button className="btn btn-primary mt-3" type="submit">
              Validate
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
