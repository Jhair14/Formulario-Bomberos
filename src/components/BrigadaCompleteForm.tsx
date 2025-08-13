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
    setCurrentStep(Math.min(3, currentStep + 1));
  };

  const handlePrevStep = () => {
    setCurrentStep(Math.max(1, currentStep - 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar que estemos en el último paso
    if (currentStep !== 3) {
      return;
    }
    
    if (!formData.brigada.NombreBrigada.trim()) {
      setError('El nombre de la brigada es requerido');
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
                  <input
                    type="number"
                    id="CantidadBomberosActivos"
                    name="CantidadBomberosActivos"
                    value={formData.brigada.CantidadBomberosActivos}
                    onChange={handleBrigadaChange}
                    className="input-field"
                    min="1"
                    required
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
                  Agregar Ropa
                </button>
              </div>
              
              {formData.equipamiento.ropa.map((ropa, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">XS</label>
                      <input
                        type="number"
                        value={ropa.CantidadXS}
                        onChange={(e) => handleEquipamientoChange('ropa', index, 'CantidadXS', Math.min(parseInt(e.target.value) || 0, 999999))}
                        className="input-field"
                        min="0"
                        max="999999"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">S</label>
                      <input
                        type="number"
                        value={ropa.CantidadS}
                        onChange={(e) => handleEquipamientoChange('ropa', index, 'CantidadS', Math.min(parseInt(e.target.value) || 0, 999999))}
                        className="input-field"
                        min="0"
                        max="999999"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">M</label>
                      <input
                        type="number"
                        value={ropa.CantidadM}
                        onChange={(e) => handleEquipamientoChange('ropa', index, 'CantidadM', Math.min(parseInt(e.target.value) || 0, 999999))}
                        className="input-field"
                        min="0"
                        max="999999"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">L</label>
                      <input
                        type="number"
                        value={ropa.CantidadL}
                        onChange={(e) => handleEquipamientoChange('ropa', index, 'CantidadL', Math.min(parseInt(e.target.value) || 0, 999999))}
                        className="input-field"
                        min="0"
                        max="999999"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">XL</label>
                      <input
                        type="number"
                        value={ropa.CantidadXL}
                        onChange={(e) => handleEquipamientoChange('ropa', index, 'CantidadXL', Math.min(parseInt(e.target.value) || 0, 999999))}
                        className="input-field"
                        min="0"
                        max="999999"
                      />
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
              ))}
            </div>

            {/* Botas */}
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Botas de Seguridad</h2>
              <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
                {[37, 38, 39, 40, 41, 42, 43].map((talla) => (
                  <div key={talla}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Talla {talla}</label>
                    <input
                      type="number"
                      value={formData.equipamiento.botas[`Talla${talla}` as keyof typeof formData.equipamiento.botas] as number}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        equipamiento: {
                          ...prev.equipamiento,
                          botas: {
                            ...prev.equipamiento.botas,
                            [`Talla${talla}`]: Math.min(parseInt(e.target.value) || 0, 999999)
                          }
                        }
                      }))}
                      className="input-field"
                      min="0"
                      max="999999"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Guantes */}
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Guantes</h2>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((talla) => (
                  <div key={talla}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Talla {talla}</label>
                    <input
                      type="number"
                      value={formData.equipamiento.guantes[`Talla${talla}` as keyof typeof formData.equipamiento.guantes] as number}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        equipamiento: {
                          ...prev.equipamiento,
                          guantes: {
                            ...prev.equipamiento.guantes,
                            [`Talla${talla}`]: Math.min(parseInt(e.target.value) || 0, 999999)
                          }
                        }
                      }))}
                      className="input-field"
                      min="0"
                      max="999999"
                    />
                  </div>
                ))}
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
                  Agregar EPP
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
                      <input
                        type="number"
                        value={item.Cantidad}
                        onChange={(e) => handleEquipamientoChange('epp', index, 'Cantidad', Math.min(parseInt(e.target.value) || 0, 999999))}
                        className="input-field"
                        min="0"
                        max="999999"
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
                  Agregar Herramienta
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
                      <input
                        type="number"
                        value={item.Cantidad}
                        onChange={(e) => handleEquipamientoChange('herramientas', index, 'Cantidad', Math.min(parseInt(e.target.value) || 0, 999999))}
                        className="input-field"
                        min="0"
                        max="999999"
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
                    Agregar {name}
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
                        <input
                          type="number"
                          value={item.Cantidad}
                          onChange={(e) => handleEquipamientoChange(key, index, 'Cantidad', Math.min(parseInt(e.target.value) || 0, 999999))}
                          className="input-field"
                          min="0"
                          max="999999"
                        />
                      </div>
                      {hasMonto && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Monto Aproximado</label>
                          <input
                            type="number"
                            value={item.MontoAproximado || 0}
                            onChange={(e) => handleEquipamientoChange(key, index, 'MontoAproximado', parseFloat(e.target.value) || 0)}
                            className="input-field"
                            min="0"
                            step="0.01"
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
              <span>{saving ? (isEditing ? 'Actualizando...' : 'Creando...') : (isEditing ? 'Actualizar Brigada Completa' : 'Crear Brigada Completa')}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrigadaCompleteForm; 