import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Save, 
  ArrowLeft, 
  Users, 
  Phone, 
  User,
  Package,
  Settings,
  ChevronRight,
  ChevronLeft,
  AlertTriangle,
  CheckCircle,
  Loader
} from 'lucide-react';
import { brigadasApi, catalogosApi, equipamientoApi } from '../services/api';
import { 
  CreateBrigadaRequest, 
  CatalogoItem,
  CreateEquipamientoRopaRequest,
  CreateEquipamientoBotasRequest,
  CreateEquipamientoGuantesRequest,
  CreateEquipamientoGenericoRequest
} from '../types/api';
import NumberInput from './NumberInput';

interface FormData {
  brigada: CreateBrigadaRequest;
  equipamiento: {
    ropa: CreateEquipamientoRopaRequest[];
    botas: CreateEquipamientoBotasRequest;
    guantes: CreateEquipamientoGuantesRequest;
    epp: CreateEquipamientoGenericoRequest[];
    herramientas: CreateEquipamientoGenericoRequest[];
    serviciosVehiculos: CreateEquipamientoGenericoRequest[];
    alimentosBebidas: CreateEquipamientoGenericoRequest[];
    equipoCampo: CreateEquipamientoGenericoRequest[];
    limpiezaPersonal: CreateEquipamientoGenericoRequest[];
    limpiezaGeneral: CreateEquipamientoGenericoRequest[];
    medicamentos: CreateEquipamientoGenericoRequest[];
    alimentosAnimales: CreateEquipamientoGenericoRequest[];
  };
}

const BrigadaCompleteForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [catalogos, setCatalogos] = useState<{
    tiposRopa: CatalogoItem[];
    equipamientoEPP: CatalogoItem[];
    herramientas: CatalogoItem[];
    serviciosVehiculos: CatalogoItem[];
    alimentosBebidas: CatalogoItem[];
    equipoCampo: CatalogoItem[];
    limpiezaPersonal: CatalogoItem[];
    limpiezaGeneral: CatalogoItem[];
    medicamentos: CatalogoItem[];
    alimentosAnimales: CatalogoItem[];
  }>({
    tiposRopa: [],
    equipamientoEPP: [],
    herramientas: [],
    serviciosVehiculos: [],
    alimentosBebidas: [],
    equipoCampo: [],
    limpiezaPersonal: [],
    limpiezaGeneral: [],
    medicamentos: [],
    alimentosAnimales: []
  });

  const [formData, setFormData] = useState<FormData>({
    brigada: {
      NombreBrigada: '',
      CantidadBomberosActivos: 0,
      ContactoCelularComandante: '',
      EncargadoLogistica: '',
      ContactoCelularLogistica: '',
      NumeroEmergenciaPublico: ''
    },
    equipamiento: {
      ropa: [],
      botas: {
        Talla37: 0, Talla38: 0, Talla39: 0, Talla40: 0, Talla41: 0, Talla42: 0, Talla43: 0,
        OtraTalla: '', CantidadOtraTalla: 0, Observaciones: ''
      },
      guantes: {
        TallaXS: 0, TallaS: 0, TallaM: 0, TallaL: 0, TallaXL: 0, TallaXXL: 0,
        OtraTalla: '', CantidadOtraTalla: 0, Observaciones: ''
      },
      epp: [],
      herramientas: [],
      serviciosVehiculos: [],
      alimentosBebidas: [],
      equipoCampo: [],
      limpiezaPersonal: [],
      limpiezaGeneral: [],
      medicamentos: [],
      alimentosAnimales: []
    }
  });

  useEffect(() => {
    if (isEditing && id) {
      fetchBrigadaData(parseInt(id));
    } else {
      fetchCatalogos();
    }
  }, [id, isEditing]);

  const fetchCatalogos = async () => {
    try {
      setLoading(true);
      const [
        tiposRopa,
        equipamientoEPP,
        herramientas,
        serviciosVehiculos,
        alimentosBebidas,
        equipoCampo,
        limpiezaPersonal,
        limpiezaGeneral,
        medicamentos,
        alimentosAnimales
      ] = await Promise.all([
        catalogosApi.getTiposRopa(),
        catalogosApi.getEquipamientoEPP(),
        catalogosApi.getHerramientas(),
        catalogosApi.getServiciosVehiculos(),
        catalogosApi.getAlimentosBebidas(),
        catalogosApi.getEquipoCampo(),
        catalogosApi.getLimpiezaPersonal(),
        catalogosApi.getLimpiezaGeneral(),
        catalogosApi.getMedicamentos(),
        catalogosApi.getAlimentosAnimales()
      ]);

      setCatalogos({
        tiposRopa: tiposRopa.data || [],
        equipamientoEPP: equipamientoEPP.data || [],
        herramientas: herramientas.data || [],
        serviciosVehiculos: serviciosVehiculos.data || [],
        alimentosBebidas: alimentosBebidas.data || [],
        equipoCampo: equipoCampo.data || [],
        limpiezaPersonal: limpiezaPersonal.data || [],
        limpiezaGeneral: limpiezaGeneral.data || [],
        medicamentos: medicamentos.data || [],
        alimentosAnimales: alimentosAnimales.data || []
      });
    } catch (err) {
      setError('Error al cargar los catálogos');
      console.error('Error fetching catalogos:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBrigadaData = async (brigadaId: number) => {
    try {
      setLoading(true);
      
      // Cargar catálogos y datos de brigada en paralelo
      const [
        brigadaResponse,
        tiposRopa,
        equipamientoEPP,
        herramientas,
        serviciosVehiculos,
        alimentosBebidas,
        equipoCampo,
        limpiezaPersonal,
        limpiezaGeneral,
        medicamentos,
        alimentosAnimales
      ] = await Promise.all([
        brigadasApi.getById(brigadaId),
        catalogosApi.getTiposRopa(),
        catalogosApi.getEquipamientoEPP(),
        catalogosApi.getHerramientas(),
        catalogosApi.getServiciosVehiculos(),
        catalogosApi.getAlimentosBebidas(),
        catalogosApi.getEquipoCampo(),
        catalogosApi.getLimpiezaPersonal(),
        catalogosApi.getLimpiezaGeneral(),
        catalogosApi.getMedicamentos(),
        catalogosApi.getAlimentosAnimales()
      ]);

      // Cargar equipamiento existente
      const [
        ropaResponse,
        botasResponse,
        guantesResponse,
        eppResponse,
        herramientasResponse,
        serviciosVehiculosResponse,
        alimentosBebidasResponse,
        equipoCampoResponse,
        limpiezaPersonalResponse,
        limpiezaGeneralResponse,
        medicamentosResponse,
        alimentosAnimalesResponse
      ] = await Promise.all([
        equipamientoApi.getRopa(brigadaId),
        equipamientoApi.getBotas(brigadaId),
        equipamientoApi.getGuantes(brigadaId),
        equipamientoApi.getGenerico(brigadaId, 'epp'),
        equipamientoApi.getGenerico(brigadaId, 'herramientas'),
        equipamientoApi.getGenerico(brigadaId, 'logistica-vehiculos'),
        equipamientoApi.getGenerico(brigadaId, 'alimentacion'),
        equipamientoApi.getGenerico(brigadaId, 'equipo-campo'),
        equipamientoApi.getGenerico(brigadaId, 'limpieza-personal'),
        equipamientoApi.getGenerico(brigadaId, 'limpieza-general'),
        equipamientoApi.getGenerico(brigadaId, 'medicamentos'),
        equipamientoApi.getGenerico(brigadaId, 'rescate-animal')
      ]);

      // Configurar catálogos
      setCatalogos({
        tiposRopa: tiposRopa.data || [],
        equipamientoEPP: equipamientoEPP.data || [],
        herramientas: herramientas.data || [],
        serviciosVehiculos: serviciosVehiculos.data || [],
        alimentosBebidas: alimentosBebidas.data || [],
        equipoCampo: equipoCampo.data || [],
        limpiezaPersonal: limpiezaPersonal.data || [],
        limpiezaGeneral: limpiezaGeneral.data || [],
        medicamentos: medicamentos.data || [],
        alimentosAnimales: alimentosAnimales.data || []
      });

      // Configurar datos de brigada
      if (brigadaResponse.success && brigadaResponse.data) {
        const brigada = brigadaResponse.data;
        setFormData(prev => ({
          ...prev,
          brigada: {
            NombreBrigada: brigada.nombre_brigada,
            CantidadBomberosActivos: brigada.cantidad_bomberos_activos,
            ContactoCelularComandante: brigada.contacto_celular_comandante,
            EncargadoLogistica: brigada.encargado_logistica,
            ContactoCelularLogistica: brigada.contacto_celular_logistica,
            NumeroEmergenciaPublico: brigada.numero_emergencia_publico
          }
        }));
      }

      // Configurar equipamiento existente
      setFormData(prev => ({
        ...prev,
        equipamiento: {
          ropa: (ropaResponse.data || []).map(ropa => ({
            TipoRopaID: ropa.tipo_ropa_id,
            CantidadXS: ropa.cantidad_xs,
            CantidadS: ropa.cantidad_s,
            CantidadM: ropa.cantidad_m,
            CantidadL: ropa.cantidad_l,
            CantidadXL: ropa.cantidad_xl,
            Observaciones: ropa.observaciones
          })),
          botas: botasResponse.data?.[0] ? {
            Talla37: botasResponse.data[0].talla_37,
            Talla38: botasResponse.data[0].talla_38,
            Talla39: botasResponse.data[0].talla_39,
            Talla40: botasResponse.data[0].talla_40,
            Talla41: botasResponse.data[0].talla_41,
            Talla42: botasResponse.data[0].talla_42,
            Talla43: botasResponse.data[0].talla_43,
            OtraTalla: botasResponse.data[0].otra_talla,
            CantidadOtraTalla: botasResponse.data[0].cantidad_otra_talla,
            Observaciones: botasResponse.data[0].observaciones
          } : {
            Talla37: 0, Talla38: 0, Talla39: 0, Talla40: 0, Talla41: 0, Talla42: 0, Talla43: 0,
            OtraTalla: '', CantidadOtraTalla: 0, Observaciones: ''
          },
          guantes: guantesResponse.data?.[0] ? {
            TallaXS: guantesResponse.data[0].talla_xs,
            TallaS: guantesResponse.data[0].talla_s,
            TallaM: guantesResponse.data[0].talla_m,
            TallaL: guantesResponse.data[0].talla_l,
            TallaXL: guantesResponse.data[0].talla_xl,
            TallaXXL: guantesResponse.data[0].talla_xxl,
            OtraTalla: guantesResponse.data[0].otra_talla,
            CantidadOtraTalla: guantesResponse.data[0].cantidad_otra_talla,
            Observaciones: guantesResponse.data[0].observaciones
          } : {
            TallaXS: 0, TallaS: 0, TallaM: 0, TallaL: 0, TallaXL: 0, TallaXXL: 0,
            OtraTalla: '', CantidadOtraTalla: 0, Observaciones: ''
          },
          epp: (eppResponse.data || []).map(epp => ({
            EquipoEPPID: epp.equipo_epp_id,
            Cantidad: epp.cantidad,
            Observaciones: epp.observaciones
          })),
          herramientas: (herramientasResponse.data || []).map(herramienta => ({
            HerramientaID: herramienta.herramienta_id,
            Cantidad: herramienta.cantidad,
            Observaciones: herramienta.observaciones
          })),
          serviciosVehiculos: (serviciosVehiculosResponse.data || []).map(servicio => ({
            ServicioVehiculoID: servicio.servicio_vehiculo_id,
            MontoAproximado: servicio.monto_aproximado,
            Cantidad: servicio.cantidad,
            Observaciones: servicio.observaciones
          })),
          alimentosBebidas: (alimentosBebidasResponse.data || []).map(alimento => ({
            AlimentoBebidaID: alimento.alimento_bebida_id,
            Cantidad: alimento.cantidad,
            Observaciones: alimento.observaciones
          })),
          equipoCampo: (equipoCampoResponse.data || []).map(equipo => ({
            EquipoCampoID: equipo.equipo_campo_id,
            Cantidad: equipo.cantidad,
            Observaciones: equipo.observaciones
          })),
          limpiezaPersonal: (limpiezaPersonalResponse.data || []).map(producto => ({
            ProductoLimpiezaPersonalID: producto.producto_limpieza_personal_id,
            Cantidad: producto.cantidad,
            Observaciones: producto.observaciones
          })),
          limpiezaGeneral: (limpiezaGeneralResponse.data || []).map(producto => ({
            ProductoLimpiezaGeneralID: producto.producto_limpieza_general_id,
            Cantidad: producto.cantidad,
            Observaciones: producto.observaciones
          })),
          medicamentos: (medicamentosResponse.data || []).map(medicamento => ({
            MedicamentoID: medicamento.medicamento_id,
            Cantidad: medicamento.cantidad,
            Observaciones: medicamento.observaciones
          })),
          alimentosAnimales: (alimentosAnimalesResponse.data || []).map(alimento => ({
            AlimentoAnimalID: alimento.alimento_animal_id,
            Cantidad: alimento.cantidad,
            Observaciones: alimento.observaciones
          }))
        }
      }));

    } catch (err) {
      setError('Error al cargar los datos de la brigada');
      console.error('Error fetching brigada data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBrigadaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      brigada: {
        ...prev.brigada,
        [name]: type === 'number' ? parseInt(value) || 0 : value
      }
    }));
  };

  const handleEquipamientoChange = (tipo: string, index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      equipamiento: {
        ...prev.equipamiento,
        [tipo]: (prev.equipamiento[tipo as keyof typeof prev.equipamiento] as any[]).map((item: any, i: number) =>
          i === index ? { ...item, [field]: value } : item
        )
      }
    }));
  };

  const addEquipamientoItem = (tipo: string) => {
    const newItem = {
      Cantidad: 0,
      Observaciones: '',
      // Agregar campos específicos según el tipo
      ...(tipo === 'ropa' && { 
        TipoRopaID: 0, 
        CantidadXS: 0, 
        CantidadS: 0, 
        CantidadM: 0, 
        CantidadL: 0, 
        CantidadXL: 0 
      }),
      ...(tipo === 'epp' && { EquipoEPPID: 0 }),
      ...(tipo === 'herramientas' && { HerramientaID: 0 }),
      ...(tipo === 'serviciosVehiculos' && { ServicioVehiculoID: 0, MontoAproximado: 0 }),
      ...(tipo === 'alimentosBebidas' && { AlimentoBebidaID: 0 }),
      ...(tipo === 'equipoCampo' && { EquipoCampoID: 0 }),
      ...(tipo === 'limpiezaPersonal' && { ProductoLimpiezaPersonalID: 0 }),
      ...(tipo === 'limpiezaGeneral' && { ProductoLimpiezaGeneralID: 0 }),
      ...(tipo === 'medicamentos' && { MedicamentoID: 0 }),
      ...(tipo === 'alimentosAnimales' && { AlimentoAnimalID: 0 })
    };

    setFormData(prev => ({
      ...prev,
      equipamiento: {
        ...prev.equipamiento,
        [tipo]: [...(prev.equipamiento[tipo as keyof typeof prev.equipamiento] as any[]), newItem]
      }
    }));
  };

  const removeEquipamientoItem = (tipo: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      equipamiento: {
        ...prev.equipamiento,
        [tipo]: (prev.equipamiento[tipo as keyof typeof prev.equipamiento] as any[]).filter((_: any, i: number) => i !== index)
      }
    }));
  };

  const handleNextStep = () => {
    // Validar el paso actual antes de avanzar
    if (!validateStep(currentStep)) {
      return;
    }
    setCurrentStep(Math.min(3, currentStep + 1));
  };

  const handlePrevStep = () => {
    setCurrentStep(Math.max(1, currentStep - 1));
  };

  const isValidPhone = (value: string, { min = 7, max = 15 }: { min?: number; max?: number } = {}) => {
    if (!value) return true; // opcional
    const digitsOnly = value.replace(/\D/g, '');
    return digitsOnly.length >= min && digitsOnly.length <= max;
  };

  const validateStep = (step: number): boolean => {
    // Limpia error previo
    setError(null);

    // Paso 1: Información de Brigada
    if (step === 1) {
      if (!formData.brigada.NombreBrigada || formData.brigada.NombreBrigada.trim().length < 3) {
        setError('El nombre de la brigada es obligatorio (mínimo 3 caracteres).');
        return false;
      }
      if (!formData.brigada.CantidadBomberosActivos || formData.brigada.CantidadBomberosActivos < 1) {
        setError('La cantidad de bomberos activos debe ser al menos 1.');
        return false;
      }
      if (!isValidPhone(formData.brigada.ContactoCelularComandante)) {
        setError('El celular del comandante debe contener entre 7 y 15 dígitos.');
        return false;
      }
      if (formData.brigada.EncargadoLogistica && formData.brigada.EncargadoLogistica.trim().length < 3) {
        setError('El nombre del encargado de logística debe tener al menos 3 caracteres.');
        return false;
      }
      if (!isValidPhone(formData.brigada.ContactoCelularLogistica)) {
        setError('El celular de logística debe contener entre 7 y 15 dígitos.');
        return false;
      }
      if (formData.brigada.NumeroEmergenciaPublico) {
        const digits = formData.brigada.NumeroEmergenciaPublico.replace(/\D/g, '');
        if (digits.length < 3 || digits.length > 6) {
          setError('El número de emergencia público debe tener entre 3 y 6 dígitos.');
          return false;
        }
      }
      return true;
    }

    // Paso 2: Equipamiento Personal
    if (step === 2) {
      for (let index = 0; index < formData.equipamiento.ropa.length; index++) {
        const ropa = formData.equipamiento.ropa[index];
        const total = (ropa.CantidadXS || 0) + (ropa.CantidadS || 0) + (ropa.CantidadM || 0) + (ropa.CantidadL || 0) + (ropa.CantidadXL || 0);
        if (total <= 0) {
          setError(`En la sección Ropa de Trabajo, el elemento #${index + 1} debe tener al menos una talla con cantidad mayor a 0.`);
          return false;
        }
      }

      const botas = formData.equipamiento.botas as any;
      if ((botas.CantidadOtraTalla || 0) > 0 && !(botas.OtraTalla || '').trim()) {
        setError('Si indicas cantidad en "Otra talla" de Botas, debes especificar el nombre de la talla.');
        return false;
      }
      if ((botas.OtraTalla || '').trim() && (!botas.CantidadOtraTalla || botas.CantidadOtraTalla <= 0)) {
        setError('Si especificas "Otra talla" de Botas, la cantidad debe ser mayor a 0.');
        return false;
      }

      const guantes = formData.equipamiento.guantes as any;
      if ((guantes.CantidadOtraTalla || 0) > 0 && !(guantes.OtraTalla || '').trim()) {
        setError('Si indicas cantidad en "Otra talla" de Guantes, debes especificar el nombre de la talla.');
        return false;
      }
      if ((guantes.OtraTalla || '').trim() && (!guantes.CantidadOtraTalla || guantes.CantidadOtraTalla <= 0)) {
        setError('Si especificas "Otra talla" de Guantes, la cantidad debe ser mayor a 0.');
        return false;
      }
      return true;
    }

    // Paso 3: Equipamiento General
    if (step === 3) {
      const validarItems = (
        items: any[],
        idField: string,
        label: string,
        options?: { montoField?: string }
      ) => {
        for (let i = 0; i < items.length; i++) {
          const it = items[i];
          if (!it[idField] || it[idField] <= 0) {
            setError(`En ${label}, el elemento #${i + 1} debe tener un tipo seleccionado.`);
            return false;
          }
          if (!it.Cantidad || it.Cantidad <= 0) {
            setError(`En ${label}, el elemento #${i + 1} debe tener cantidad mayor a 0.`);
            return false;
          }
          if (options?.montoField) {
            const mf = options.montoField;
            if (it[mf] == null || isNaN(Number(it[mf])) || Number(it[mf]) < 0) {
              setError(`En ${label}, el elemento #${i + 1} tiene un monto inválido.`);
              return false;
            }
          }
        }
        return true;
      };

      if (!validarItems(formData.equipamiento.epp, 'EquipoEPPID', 'EPP')) return false;
      if (!validarItems(formData.equipamiento.herramientas, 'HerramientaID', 'Herramientas')) return false;
      if (!validarItems(formData.equipamiento.serviciosVehiculos, 'ServicioVehiculoID', 'Servicios de Vehículos', { montoField: 'MontoAproximado' })) return false;
      if (!validarItems(formData.equipamiento.alimentosBebidas, 'AlimentoBebidaID', 'Alimentos y Bebidas')) return false;
      if (!validarItems(formData.equipamiento.equipoCampo, 'EquipoCampoID', 'Equipo de Campo')) return false;
      if (!validarItems(formData.equipamiento.limpiezaPersonal, 'ProductoLimpiezaPersonalID', 'Limpieza Personal')) return false;
      if (!validarItems(formData.equipamiento.limpiezaGeneral, 'ProductoLimpiezaGeneralID', 'Limpieza General')) return false;
      if (!validarItems(formData.equipamiento.medicamentos, 'MedicamentoID', 'Medicamentos')) return false;
      if (!validarItems(formData.equipamiento.alimentosAnimales, 'AlimentoAnimalID', 'Alimentos para Animales')) return false;
      return true;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar que estemos en el último paso
    if (currentStep !== 3) {
      return;
    }

    // Validar todos los pasos antes de enviar
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      let brigadaId: number;

      if (isEditing && id) {
        // Actualizar brigada existente
        await brigadasApi.update(parseInt(id), formData.brigada);
        brigadaId = parseInt(id);
        console.log('Brigada actualizada con ID:', brigadaId);
        
        // Si estamos editando, eliminar todo el equipamiento existente primero
        try {
          // Eliminar equipamiento existente
          await Promise.all([
            equipamientoApi.deleteRopa(brigadaId),
            equipamientoApi.deleteBotas(brigadaId),
            equipamientoApi.deleteGuantes(brigadaId),
            equipamientoApi.deleteGenerico(brigadaId, 'epp'),
            equipamientoApi.deleteGenerico(brigadaId, 'herramientas'),
            equipamientoApi.deleteGenerico(brigadaId, 'logistica-vehiculos'),
            equipamientoApi.deleteGenerico(brigadaId, 'alimentacion'),
            equipamientoApi.deleteGenerico(brigadaId, 'equipo-campo'),
            equipamientoApi.deleteGenerico(brigadaId, 'limpieza-personal'),
            equipamientoApi.deleteGenerico(brigadaId, 'limpieza-general'),
            equipamientoApi.deleteGenerico(brigadaId, 'medicamentos'),
            equipamientoApi.deleteGenerico(brigadaId, 'rescate-animal')
          ]);
          console.log('Equipamiento existente eliminado');
        } catch (deleteError) {
          console.log('Error al eliminar equipamiento existente (puede que no exista):', deleteError);
          // Continuar aunque falle la eliminación
        }
      } else {
        // Crear nueva brigada
        const brigadaResponse = await brigadasApi.create(formData.brigada);
        if (!brigadaResponse.success || !brigadaResponse.data) {
          throw new Error('Error al crear la brigada');
        }
        brigadaId = brigadaResponse.data.id;
        console.log('Brigada creada con ID:', brigadaId);
      }

      // 2. Crear equipamiento
      const equipamientoPromises = [];

      // Ropa
      for (const ropa of formData.equipamiento.ropa) {
        if (ropa.CantidadXS > 0 || ropa.CantidadS > 0 || ropa.CantidadM > 0 || ropa.CantidadL > 0 || ropa.CantidadXL > 0) {
          equipamientoPromises.push(equipamientoApi.createRopa(brigadaId, ropa));
        }
      }

      // Botas
      const botasData = formData.equipamiento.botas;
      const hasBotas = Object.entries(botasData).some(([key, value]) => {
        if (key.startsWith('Talla') && key !== 'TallaOtra') {
          return typeof value === 'number' && value > 0;
        }
        return false;
      });
      
      if (hasBotas) {
        const cleanedBotasData = cleanBotasData(botasData);
        console.log('Enviando datos de botas:', cleanedBotasData);
        equipamientoPromises.push(equipamientoApi.createBotas(brigadaId, cleanedBotasData));
      }

      // Guantes
      const guantesData = formData.equipamiento.guantes;
      const hasGuantes = Object.entries(guantesData).some(([key, value]) => {
        if (key.startsWith('Talla') && key !== 'TallaOtra') {
          return typeof value === 'number' && value > 0;
        }
        return false;
      });
      
      if (hasGuantes) {
        const cleanedGuantesData = cleanGuantesData(guantesData);
        console.log('Enviando datos de guantes:', cleanedGuantesData);
        equipamientoPromises.push(equipamientoApi.createGuantes(brigadaId, cleanedGuantesData));
      }

      // Equipamiento genérico
      const tiposGenericos = [
        { frontendKey: 'epp', backendRoute: 'epp', idField: 'EquipoEPPID' },
        { frontendKey: 'herramientas', backendRoute: 'herramientas', idField: 'HerramientaID' },
        { frontendKey: 'serviciosVehiculos', backendRoute: 'logistica-vehiculos', idField: 'ServicioVehiculoID' },
        { frontendKey: 'alimentosBebidas', backendRoute: 'alimentacion', idField: 'AlimentoBebidaID' },
        { frontendKey: 'equipoCampo', backendRoute: 'equipo-campo', idField: 'EquipoCampoID' },
        { frontendKey: 'limpiezaPersonal', backendRoute: 'limpieza-personal', idField: 'ProductoLimpiezaPersonalID' },
        { frontendKey: 'limpiezaGeneral', backendRoute: 'limpieza-general', idField: 'ProductoLimpiezaGeneralID' },
        { frontendKey: 'medicamentos', backendRoute: 'medicamentos', idField: 'MedicamentoID' },
        { frontendKey: 'alimentosAnimales', backendRoute: 'rescate-animal', idField: 'AlimentoAnimalID' }
      ];
      
      for (const tipo of tiposGenericos) {
        const items = formData.equipamiento[tipo.frontendKey as keyof typeof formData.equipamiento] as CreateEquipamientoGenericoRequest[];
        for (const item of items) {
          if (item.Cantidad > 0 && item[tipo.idField] > 0) {
            equipamientoPromises.push(equipamientoApi.createGenerico(brigadaId, tipo.backendRoute, item));
          }
        }
      }

      // Ejecutar todas las promesas de equipamiento
      console.log('Ejecutando', equipamientoPromises.length, 'promesas de equipamiento');
      
      try {
        await Promise.all(equipamientoPromises);
      } catch (equipamientoError: any) {
        console.error('Error al crear equipamiento:', equipamientoError);
        throw new Error(`Error al crear equipamiento: ${equipamientoError.message}`);
      }

      setSuccess(isEditing ? 'Brigada actualizada exitosamente con todo su equipamiento' : 'Brigada creada exitosamente con todo su equipamiento');
      
      setTimeout(() => {
        navigate('/brigadas');
      }, 2000);

    } catch (err) {
      setError('Error al crear la brigada');
      console.error('Error saving brigada:', err);
    } finally {
      setSaving(false);
    }
  };

  const cleanBotasData = (botasData: any) => {
    const limitValue = (value: any) => {
      const num = parseInt(value) || 0;
      return Math.min(Math.max(num, 0), 999999); // Limitar a 999,999 máximo
    };

    return {
      Talla37: limitValue(botasData.Talla37),
      Talla38: limitValue(botasData.Talla38),
      Talla39: limitValue(botasData.Talla39),
      Talla40: limitValue(botasData.Talla40),
      Talla41: limitValue(botasData.Talla41),
      Talla42: limitValue(botasData.Talla42),
      Talla43: limitValue(botasData.Talla43),
      OtraTalla: botasData.OtraTalla || '',
      CantidadOtraTalla: limitValue(botasData.CantidadOtraTalla),
      Observaciones: botasData.Observaciones || ''
    };
  };

  const cleanGuantesData = (guantesData: any) => {
    const limitValue = (value: any) => {
      const num = parseInt(value) || 0;
      return Math.min(Math.max(num, 0), 999999); // Limitar a 999,999 máximo
    };

    return {
      TallaXS: limitValue(guantesData.TallaXS),
      TallaS: limitValue(guantesData.TallaS),
      TallaM: limitValue(guantesData.TallaM),
      TallaL: limitValue(guantesData.TallaL),
      TallaXL: limitValue(guantesData.TallaXL),
      TallaXXL: limitValue(guantesData.TallaXXL),
      OtraTalla: guantesData.OtraTalla || '',
      CantidadOtraTalla: limitValue(guantesData.CantidadOtraTalla),
      Observaciones: guantesData.Observaciones || ''
    };
  };

  const steps = [
    { id: 1, name: 'Información de Brigada', icon: Users },
    { id: 2, name: 'Equipamiento Personal', icon: Package },
    { id: 3, name: 'Equipamiento General', icon: Settings }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/brigadas')}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{isEditing ? 'Editar Brigada Completa' : 'Nueva Brigada Completa'}</h1>
            <p className="text-gray-600">{isEditing ? 'Modifica la brigada y todo su equipamiento' : 'Crea una brigada con todo su equipamiento'}</p>
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            
            return (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  isActive ? 'border-primary-600 bg-primary-600 text-white' :
                  isCompleted ? 'border-green-500 bg-green-500 text-white' :
                  'border-gray-300 bg-white text-gray-500'
                }`}>
                  {isCompleted ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  isActive ? 'text-primary-600' : 'text-gray-500'
                }`}>
                  {step.name}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    isCompleted ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Alertas */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <span className="text-green-700">{success}</span>
        </div>
      )}

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Paso 1: Información de Brigada */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Users className="h-5 w-5 text-primary-600" />
                <span>Información General</span>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="NombreBrigada" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre de la Brigada *
                  </label>
                  <input
                    type="text"
                    id="NombreBrigada"
                    name="NombreBrigada"
                    value={formData.brigada.NombreBrigada}
                    onChange={handleBrigadaChange}
                    className="input-field"
                    placeholder="Ej: Brigada Central"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="CantidadBomberosActivos" className="block text-sm font-medium text-gray-700 mb-1">
                    Cantidad de Bomberos Activos *
                  </label>
                  <NumberInput
                    value={formData.brigada.CantidadBomberosActivos}
                    onChange={(value) => setFormData(prev => ({
                      ...prev,
                      brigada: {
                        ...prev.brigada,
                        CantidadBomberosActivos: value
                      }
                    }))}
                    min={1}
                  />
                </div>
              </div>
            </div>

            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Phone className="h-5 w-5 text-primary-600" />
                <span>Información de Contacto</span>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="ContactoCelularComandante" className="block text-sm font-medium text-gray-700 mb-1">
                    Celular del Comandante
                  </label>
                  <input
                    type="tel"
                    id="ContactoCelularComandante"
                    name="ContactoCelularComandante"
                    value={formData.brigada.ContactoCelularComandante}
                    onChange={handleBrigadaChange}
                    className="input-field"
                    placeholder="Ej: 1234567890"
                  />
                </div>

                <div>
                  <label htmlFor="NumeroEmergenciaPublico" className="block text-sm font-medium text-gray-700 mb-1">
                    Número de Emergencia Público
                  </label>
                  <input
                    type="tel"
                    id="NumeroEmergenciaPublico"
                    name="NumeroEmergenciaPublico"
                    value={formData.brigada.NumeroEmergenciaPublico}
                    onChange={handleBrigadaChange}
                    className="input-field"
                    placeholder="Ej: 911"
                  />
                </div>
              </div>
            </div>

            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <User className="h-5 w-5 text-primary-600" />
                <span>Información de Logística</span>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="EncargadoLogistica" className="block text-sm font-medium text-gray-700 mb-1">
                    Encargado de Logística
                  </label>
                  <input
                    type="text"
                    id="EncargadoLogistica"
                    name="EncargadoLogistica"
                    value={formData.brigada.EncargadoLogistica}
                    onChange={handleBrigadaChange}
                    className="input-field"
                    placeholder="Ej: Juan Pérez"
                  />
                </div>

                <div>
                  <label htmlFor="ContactoCelularLogistica" className="block text-sm font-medium text-gray-700 mb-1">
                    Celular de Logística
                  </label>
                  <input
                    type="tel"
                    id="ContactoCelularLogistica"
                    name="ContactoCelularLogistica"
                    value={formData.brigada.ContactoCelularLogistica}
                    onChange={handleBrigadaChange}
                    className="input-field"
                    placeholder="Ej: 0987654321"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Paso 2: Equipamiento Personal */}
        {currentStep === 2 && (
          <div className="space-y-6">
            {/* Ropa */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Ropa de Trabajo</h2>
                <button
                  type="button"
                  onClick={() => addEquipamientoItem('ropa')}
                  className="btn-primary text-sm"
                >
                  AGREGAR
                </button>
              </div>
              

              
              {formData.equipamiento.ropa.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Package className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No hay tipos de ropa agregados</p>
                  <p className="text-sm">Haz clic en "AGREGAR" para comenzar</p>
                </div>
              ) : (
                formData.equipamiento.ropa.map((ropa, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                                                        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                     <div className="md:col-span-2">
                       <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Ropa *</label>
                       <select
                         value={ropa.TipoRopaID || ''}
                         onChange={(e) => handleEquipamientoChange('ropa', index, 'TipoRopaID', parseInt(e.target.value) || 0)}
                         className="input-field"
                         required
                       >
                         <option value="">Seleccionar Tipo de Ropa</option>
                         <option value="1">CAMISA FORESTAL</option>
                         <option value="2">PANTALON FORESTAL</option>
                         <option value="3">OVEROL FR</option>
                         <option value="4">OTRO</option>
                       </select>
                       {ropa.TipoRopaID === 4 && (
                         <input
                           type="text"
                           value={ropa.Observaciones || ''}
                           onChange={(e) => handleEquipamientoChange('ropa', index, 'Observaciones', e.target.value)}
                           className="input-field mt-2"
                           placeholder="Especificar otro tipo de ropa"
                         />
                       )}
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Cant. XS</label>
                       <NumberInput
                         value={ropa.CantidadXS}
                         onChange={(value) => handleEquipamientoChange('ropa', index, 'CantidadXS', value)}
                         min={0}
                         max={999999}
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Cant. S</label>
                       <NumberInput
                         value={ropa.CantidadS}
                         onChange={(value) => handleEquipamientoChange('ropa', index, 'CantidadS', value)}
                         min={0}
                         max={999999}
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Cant. M</label>
                       <NumberInput
                         value={ropa.CantidadM}
                         onChange={(value) => handleEquipamientoChange('ropa', index, 'CantidadM', value)}
                         min={0}
                         max={999999}
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Cant. L</label>
                       <NumberInput
                         value={ropa.CantidadL}
                         onChange={(value) => handleEquipamientoChange('ropa', index, 'CantidadL', value)}
                         min={0}
                         max={999999}
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Cant. XL</label>
                       <NumberInput
                         value={ropa.CantidadXL}
                         onChange={(value) => handleEquipamientoChange('ropa', index, 'CantidadXL', value)}
                         min={0}
                         max={999999}
                       />
                     </div>
                   </div>
                   <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                     
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
                       <input
                         type="text"
                         value={ropa.Observaciones}
                         onChange={(e) => handleEquipamientoChange('ropa', index, 'Observaciones', e.target.value)}
                         className="input-field"
                         placeholder="Observaciones"
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Total de unidades</label>
                       <div className="bg-gray-100 border border-gray-300 rounded px-3 py-2 text-center font-semibold text-gray-700">
                         {(ropa.CantidadXS || 0) + (ropa.CantidadS || 0) + (ropa.CantidadM || 0) + (ropa.CantidadL || 0) + (ropa.CantidadXL || 0)}
                       </div>
                     </div>
                     <div className="flex items-end">
                       <button
                         type="button"
                         onClick={() => removeEquipamientoItem('ropa', index)}
                         className="btn-secondary text-sm"
                       >
                         Eliminar
                       </button>
                     </div>
                   </div>
                </div>
                ))
              )}
            </div>

                         {/* Botas */}
             <div className="card">
               <h2 className="text-lg font-semibold text-gray-900 mb-4">Botas de Seguridad</h2>
               <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
                 {[37, 38, 39, 40, 41, 42, 43].map((talla) => (
                   <div key={talla}>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Talla {talla}</label>
                     <NumberInput
                       value={formData.equipamiento.botas[`Talla${talla}` as keyof typeof formData.equipamiento.botas] as number}
                       onChange={(value) => {
                         setFormData(prev => ({
                           ...prev,
                           equipamiento: {
                             ...prev.equipamiento,
                             botas: {
                               ...prev.equipamiento.botas,
                               [`Talla${talla}`]: value
                             }
                           }
                         }));
                       }}
                       min={0}
                       max={999999}
                     />
                   </div>
                 ))}
               </div>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Otra Talla</label>
                   <input
                     type="text"
                     value={formData.equipamiento.botas.OtraTalla}
                     onChange={(e) => {
                       setFormData(prev => ({
                         ...prev,
                         equipamiento: {
                           ...prev.equipamiento,
                           botas: {
                             ...prev.equipamiento.botas,
                             OtraTalla: e.target.value
                           }
                         }
                       }));
                     }}
                     className="input-field"
                     placeholder="Ej: 44, 45"
                   />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad Otra Talla</label>
                   <NumberInput
                     value={formData.equipamiento.botas.CantidadOtraTalla}
                     onChange={(value) => {
                       setFormData(prev => ({
                         ...prev,
                         equipamiento: {
                           ...prev.equipamiento,
                           botas: {
                             ...prev.equipamiento.botas,
                             CantidadOtraTalla: value
                           }
                         }
                       }));
                     }}
                     min={0}
                     max={999999}
                   />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
                   <input
                     type="text"
                     value={formData.equipamiento.botas.Observaciones}
                     onChange={(e) => {
                       setFormData(prev => ({
                         ...prev,
                         equipamiento: {
                           ...prev.equipamiento,
                           botas: {
                             ...prev.equipamiento.botas,
                             Observaciones: e.target.value
                           }
                         }
                       }));
                     }}
                     className="input-field"
                     placeholder="Observaciones sobre las botas"
                   />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Total de unidades</label>
                   <div className="bg-gray-100 border border-gray-300 rounded px-3 py-2 text-center font-semibold text-gray-700">
                     {['XS', 'S', 'M', 'L', 'XL', 'XXL'].reduce((total, talla) => 
                       total + (formData.equipamiento.guantes[`Talla${talla}` as keyof typeof formData.equipamiento.guantes] as number || 0), 0
                     )}
                   </div>
                 </div>
               </div>
            </div>

                         {/* Guantes */}
             <div className="card">
               <h2 className="text-lg font-semibold text-gray-900 mb-4">Guantes</h2>
               <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                 {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((talla) => (
                   <div key={talla}>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Talla {talla}</label>
                     <NumberInput
                       value={formData.equipamiento.guantes[`Talla${talla}` as keyof typeof formData.equipamiento.guantes] as number}
                       onChange={(value) => {
                         setFormData(prev => ({
                           ...prev,
                           equipamiento: {
                             ...prev.equipamiento,
                             guantes: {
                               ...prev.equipamiento.guantes,
                               [`Talla${talla}`]: value
                             }
                           }
                         }));
                       }}
                       min={0}
                       max={999999}
                     />
                   </div>
                 ))}
               </div>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Otra Talla</label>
                   <input
                     type="text"
                     value={formData.equipamiento.guantes.OtraTalla}
                     onChange={(e) => {
                       setFormData(prev => ({
                         ...prev,
                         equipamiento: {
                           ...prev.equipamiento,
                           guantes: {
                             ...prev.equipamiento.guantes,
                             OtraTalla: e.target.value
                           }
                         }
                       }));
                     }}
                     className="input-field"
                     placeholder="Ej: XXS, XXXL"
                   />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad Otra Talla</label>
                   <NumberInput
                     value={formData.equipamiento.guantes.CantidadOtraTalla}
                     onChange={(value) => {
                       setFormData(prev => ({
                         ...prev,
                         equipamiento: {
                           ...prev.equipamiento,
                           guantes: {
                             ...prev.equipamiento.guantes,
                             CantidadOtraTalla: value
                           }
                         }
                       }));
                     }}
                     min={0}
                     max={999999}
                   />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
                   <input
                     type="text"
                     value={formData.equipamiento.guantes.Observaciones}
                     onChange={(e) => {
                       setFormData(prev => ({
                         ...prev,
                         equipamiento: {
                           ...prev.equipamiento,
                           guantes: {
                             ...prev.equipamiento.guantes,
                             Observaciones: e.target.value
                           }
                         }
                       }));
                     }}
                     className="input-field"
                     placeholder="Observaciones sobre los guantes"
                   />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Total de unidades</label>
                   <div className="bg-gray-100 border border-gray-300 rounded px-3 py-2 text-center font-semibold text-gray-700">
                     {['XS', 'S', 'M', 'L', 'XL', 'XXL'].reduce((total, talla) => 
                       total + (formData.equipamiento.guantes[`Talla${talla}` as keyof typeof formData.equipamiento.guantes] as number || 0), 0
                     )}
                   </div>
                 </div>
               </div>
            </div>
          </div>
        )}

        {/* Paso 3: Equipamiento General */}
        {currentStep === 3 && (
          <div className="space-y-6">
            {/* EPP */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Equipamiento de Protección Personal (EPP)</h2>
                <button
                  type="button"
                  onClick={() => addEquipamientoItem('epp')}
                  className="btn-primary text-sm"
                >
                  AGREGAR
                </button>
              </div>
              
              {formData.equipamiento.epp.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de EPP *</label>
                      <select
                        value={item.EquipoEPPID || ''}
                        onChange={(e) => handleEquipamientoChange('epp', index, 'EquipoEPPID', parseInt(e.target.value) || 0)}
                        className="input-field"
                        required
                      >
                        <option value="">Seleccionar EPP</option>
                        {catalogos.equipamientoEPP.map((epp) => (
                          <option key={epp.id} value={epp.id}>
                            {epp.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
                      <NumberInput
                        value={item.Cantidad}
                        onChange={(value) => handleEquipamientoChange('epp', index, 'Cantidad', value)}
                        min={0}
                        max={999999}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
                      <input
                        type="text"
                        value={item.Observaciones}
                        onChange={(e) => handleEquipamientoChange('epp', index, 'Observaciones', e.target.value)}
                        className="input-field"
                        placeholder="Descripción del EPP"
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() => removeEquipamientoItem('epp', index)}
                        className="btn-secondary text-sm"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Herramientas */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Herramientas</h2>
                <button
                  type="button"
                  onClick={() => addEquipamientoItem('herramientas')}
                  className="btn-primary text-sm"
                >
                  AGREGAR
                </button>
              </div>
              
              {formData.equipamiento.herramientas.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Herramienta *</label>
                      <select
                        value={item.HerramientaID || ''}
                        onChange={(e) => handleEquipamientoChange('herramientas', index, 'HerramientaID', parseInt(e.target.value) || 0)}
                        className="input-field"
                        required
                      >
                        <option value="">Seleccionar Herramienta</option>
                        {catalogos.herramientas.map((herramienta) => (
                          <option key={herramienta.id} value={herramienta.id}>
                            {herramienta.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
                      <NumberInput
                        value={item.Cantidad}
                        onChange={(value) => handleEquipamientoChange('herramientas', index, 'Cantidad', value)}
                        min={0}
                        max={999999}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
                      <input
                        type="text"
                        value={item.Observaciones}
                        onChange={(e) => handleEquipamientoChange('herramientas', index, 'Observaciones', e.target.value)}
                        className="input-field"
                        placeholder="Descripción de la herramienta"
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() => removeEquipamientoItem('herramientas', index)}
                        className="btn-secondary text-sm"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Otros equipamientos similares */}
            {[
              { key: 'serviciosVehiculos', name: 'Servicios de Vehículos', catalogKey: 'serviciosVehiculos', idField: 'ServicioVehiculoID', hasMonto: true },
              { key: 'alimentosBebidas', name: 'Alimentos y Bebidas', catalogKey: 'alimentosBebidas', idField: 'AlimentoBebidaID', hasMonto: false },
              { key: 'equipoCampo', name: 'Equipo de Campo', catalogKey: 'equipoCampo', idField: 'EquipoCampoID', hasMonto: false },
              { key: 'limpiezaPersonal', name: 'Limpieza Personal', catalogKey: 'limpiezaPersonal', idField: 'ProductoLimpiezaPersonalID', hasMonto: false },
              { key: 'limpiezaGeneral', name: 'Limpieza General', catalogKey: 'limpiezaGeneral', idField: 'ProductoLimpiezaGeneralID', hasMonto: false },
              { key: 'medicamentos', name: 'Medicamentos', catalogKey: 'medicamentos', idField: 'MedicamentoID', hasMonto: false },
              { key: 'alimentosAnimales', name: 'Alimentos para Animales', catalogKey: 'alimentosAnimales', idField: 'AlimentoAnimalID', hasMonto: false }
            ].map(({ key, name, catalogKey, idField, hasMonto }) => (
              <div key={key} className="card">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">{name}</h2>
                  <button
                    type="button"
                    onClick={() => addEquipamientoItem(key)}
                    className="btn-primary text-sm"
                  >
                    AGREGAR
                  </button>
                </div>
                
                {(formData.equipamiento[key as keyof typeof formData.equipamiento] as any[]).map((item: any, index: number) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                    <div className={`grid grid-cols-1 md:grid-cols-${hasMonto ? '5' : '4'} gap-4`}>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de {name} *</label>
                        <select
                          value={item[idField] || ''}
                          onChange={(e) => handleEquipamientoChange(key, index, idField, parseInt(e.target.value) || 0)}
                          className="input-field"
                          required
                        >
                          <option value="">Seleccionar {name}</option>
                          {catalogos[catalogKey as keyof typeof catalogos].map((catalogo: any) => (
                            <option key={catalogo.id} value={catalogo.id}>
                              {catalogo.nombre}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
                        <NumberInput
                          value={item.Cantidad}
                          onChange={(value) => handleEquipamientoChange(key, index, 'Cantidad', value)}
                          min={0}
                          max={999999}
                        />
                      </div>
                      {hasMonto && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Monto Aproximado</label>
                          <NumberInput
                            value={item.MontoAproximado || 0}
                            onChange={(value) => handleEquipamientoChange(key, index, 'MontoAproximado', value)}
                            min={0}
                            max={999999}
                            step={0.01}
                          />
                        </div>
                      )}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
                        <input
                          type="text"
                          value={item.Observaciones}
                          onChange={(e) => handleEquipamientoChange(key, index, 'Observaciones', e.target.value)}
                          className="input-field"
                          placeholder={`Descripción de ${name.toLowerCase()}`}
                        />
                      </div>
                      <div className="flex items-end">
                        <button
                          type="button"
                          onClick={() => removeEquipamientoItem(key, index)}
                          className="btn-secondary text-sm"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </form>

      {/* Navegación entre pasos - FUERA DEL FORMULARIO */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={handlePrevStep}
          disabled={currentStep === 1}
          className="btn-secondary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Anterior</span>
        </button>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => navigate('/brigadas')}
            className="btn-secondary"
            disabled={saving}
          >
            Cancelar
          </button>
          
          {currentStep < 3 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="btn-primary flex items-center space-x-2"
            >
              <span>Siguiente</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="btn-primary flex items-center space-x-2"
              disabled={saving}
            >
              {saving ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              <span>{saving ? (isEditing ? 'Actualizando...' : 'Creando...') : 'Finalizar'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrigadaCompleteForm; 